import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import google.generativeai as genai
import os
import streamlit as st
from dotenv import load_dotenv
import pandas as pd
import csv
from fpdf import FPDF
import json
import matplotlib.pyplot as plt
import tempfile


load_dotenv()
gemini_api_key = os.getenv("GEMINI_API_KEY")
if not gemini_api_key:
    raise ValueError("GEMINI_API_KEY environment variable not set")

# Initialize Firebase Admin SDK
if not firebase_admin._apps:
 cred = credentials.Certificate("./firebase_creds.json")
 firebase_admin.initialize_app(cred)

db = firestore.client() 


def retrieve_data_from_firestore():
   try:
        # Assuming you have a collection named "feedback" and you want to retrieve all documents
        feedback_collection = db.collection("team_feedbacks").stream()

        data_list = []

        # Iterate through the documents in the collection
        for doc in feedback_collection:
            # Access document data using .to_dict() method
            data = doc.to_dict()
            data_list.append(data)
           
        csv_file = "database_csv.csv"
        with open(csv_file, "w", newline="") as f:
            writer = csv.DictWriter(f, fieldnames=data_list[0].keys())
            writer.writeheader()
            writer.writerows(data_list)

   except Exception as e:
        print("Error retrieving data:", e)


def retrieve_data_to_list():
    feedback_collection = db.collection("team_feedbacks").stream()

    data_list = []
    for doc in feedback_collection:
        data = doc.to_dict()
        data_list.append(data)

    return pd.DataFrame(data_list)


def calculate_avg_from_csv(csv_file):
    try:
        # Read CSV file into a pandas DataFrame
        df = pd.read_csv(csv_file)

        # Calculate average rating for each question
        df_numeric=df.apply(pd.to_numeric, errors='coerce')
        avg_rating = df_numeric.mean().to_dict()

        
        return avg_rating
    except Exception as e:
        print("Error calculating average from CSV:", e)        

def pull_suggestions(csv_file):
    try:
       fd=pd.read_csv(csv_file)
       suggestion_dict={}
       for index,row in fd.iterrows():
          suggestion_dict[index]=row['suggestion']
       return suggestion_dict 
            
    except Exception as e:
        print("Error pulling suggestions:",e)


genai.configure(api_key=gemini_api_key)

def generate_feedback(avg_values,suggestion_dict):
    try:
        model = genai.GenerativeModel("gemini-pro")
        
        prompt_2="""Generate better version of the provided Suggestions in concise bullet points if present other wise write 'No Suggestions': {i}
               -SUGGESTIONS:"""       
        
        prompt = """Please provide your feedback for each aspect of the hackathon by analyzing the average rating received for each question with 1 being the lowest and 5 being the highest for the following questions. 
1. How would you rate the overall organization and logistics of the hackathon? (Average rating: {q1})
- Feedback:
2. How satisfied were you with the venue and facilities provided? (Average rating: {q2})
   - Feedback:
3. How well did the hackathon theme align with your interests and expertise? (Average rating: {q3})
   - Feedback:
4. How satisfied were you with the communication channels and updates throughout the hackathon? (Average rating: {q4})
   - Feedback:
5. How satisfied were you with the judging criteria and evaluation process? (Average rating: {q5})
    - Feedback:
6. How well did the hackathon challenge stimulate creativity and innovation? (Average rating: {q6})
    - Feedback:
7. Rate the fairness and transparency of the judging decisions. (Average rating: {q7})
    - Feedback:
8. Rate your overall satisfaction with the hackathon experience. (Average rating: {q8})
    - Feedback:"""
        
        
        modified_prompt_2=prompt_2.format(
           i=json.dumps(suggestion_dict) 
        )
        modified_prompt = prompt.format(
            q1=avg_values.get('q1', ''),
            q2=avg_values.get('q2', ''),
            q3=avg_values.get('q3', ''),
            q4=avg_values.get('q4', ''),
            q5=avg_values.get('q5', ''),
            q6=avg_values.get('q6', ''),
            q7=avg_values.get('q7', ''),
            q8=avg_values.get('q8', ''),
            )
        modified_prompt = prompt.format(**avg_values)
        response = model.generate_content(modified_prompt)
        response_2=model.generate_content(modified_prompt_2)
        return response.text+'\n\n\n'+response_2.text
    except Exception as e:
        error_message = f"Error generating response: {e}"
        return error_message
    
        
def generate_pdf(data,data1,barplot,output_path):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.multi_cell(0,10,txt=data)
    with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmpfile:  
        # Save the bar plot image to the temporary file
            barplot.savefig(tmpfile.name)

        # Get the dimensions of the image
            _, _, w, h = pdf.get_x(), pdf.get_y(), 100, 100
            

        # Insert the bar plot image into the PDF
            pdf.image(tmpfile.name, x=10, y=pdf.get_y() + 10, w=w, h=h)
            plt.close(barplot)

    unwanted_fields=['suggestion']
    question_order=['q1','q2','q3','q4','q5','q6','q7','q8']
    for question in question_order:
        if question in data1.columns and question not in unwanted_fields:
         with tempfile.NamedTemporaryFile(delete=False, suffix='.png') as tmpfile:
            ratings_count = data1[question].value_counts().sort_index()
            plt.pie(ratings_count, labels=ratings_count.index, autopct='%1.1f%%')
            plt.title(f'Distribution of Ratings for "{question}"')
            plt.axis('equal')  # Equal aspect ratio ensures that pie is drawn as a circle
            plt.savefig(tmpfile.name)
            plt.close()

            # Add the pie chart image to the PDF
            pdf.add_page()
            pdf.set_font("Arial", size=12)
            # pdf.cell(200, 10, txt=f"Distribution of Ratings for '{question}'", ln=True, align='C')
            pdf.image(tmpfile.name, x=10, y=pdf.get_y() + 10, w=180)

    pdf.output(output_path)

def graphical_analysis(avg_values):
    
    avg_df = pd.DataFrame(list(avg_values.items()), columns=['Question', 'Average Rating'])
   

    # Sort DataFrame based on 'Question' column to maintain chronological order
    avg_df['Question'] = pd.Categorical(avg_df['Question'], categories=[
                                        'q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8'], ordered=True)
    avg_df = avg_df.sort_values('Question')
    fig, ax = plt.subplots()
    avg_df.set_index('Question').plot(kind='bar', ax=ax)
    return fig

def main():
    st.title('Hackathon Feedback Generator')
    st.write("Click the button below to generate a PDF of the data.")
    if st.button("Generate PDF"):
     retrieve_data_from_firestore()
     data1=retrieve_data_to_list()
     avg_values=calculate_avg_from_csv(r"./database_csv.csv")
     suggestion_dict=pull_suggestions(r"./database_csv.csv")
   
     data = generate_feedback(avg_values,suggestion_dict)
     # Path where the pdf must be downloaded
     output_path = r'./output.pdf'
    # Storing barplot
     barplot=graphical_analysis(avg_values)
     generate_pdf(data,data1,barplot,output_path)
     st.success("PDF generated successfully. You can find it at: {}".format(output_path))
     

if __name__ == "__main__":
    main()
    
