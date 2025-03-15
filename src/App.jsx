import './App.css';
import Form from './components/Form';
import Background from './components/Background';
import Home from './components/Home';
import Footer from './components/Footer';
import { db } from "./components/config/FirebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import { useEffect, useState } from 'react';

function App() { 
  const databaseRef = collection(db, "team_feedbacks");
  const [datalist, setdata] = useState([]); 
  let maxQ = 8; //no of questions
  const QAverage = Array(maxQ).fill(0.0);

  //data retrieving function...
  const GetData = async () =>{
    //retrieving all the data along with the team name...
    const ogdata = await getDocs(databaseRef);
    const data = ogdata.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    setdata(data);
  }

  //Since the GetData doesn't works on first try
  //therefore using useEffect to atleast run it once
  useEffect(() => { GetData() }, []);

  //To show data and call calculation function
  const ShowData = () => {
    GetData();
    console.log("\nDatalist : ", datalist);
    Avg();
  }

  //Average calculating function...
  const Avg = async () => {
    // For Dynamically finding the max num of questions
    // set maxQ = 0
    // datalist.forEach(item => {
    //     Object.keys(item).forEach(key => {
    //         if (key.startsWith("q")) {
    //             const qNum = parseInt(key.slice(1));
    //             if (qNum > maxQ) {
    //                 maxQ = qNum;
    //             } } }); });

    let sums = Array(maxQ).fill(0);
    let counts = Array(maxQ).fill(0);
    
    // Accessing the values of each questions of every teams...
    // calculating the average and storing them in the variables according to the questions...
    datalist.forEach(item => {
      Object.keys(item).forEach(key => {
          if (key.startsWith("q")) {
              const index = parseInt(key.slice(1)) - 1; // Extract question number and convert to index
              const value = item[key];
              if (!isNaN(value)) { // Check if value is a number
                  sums[index] += value; // Update sum
                  if (value !== 0) {
                      counts[index]++; // Update count if value is not 0
          }}}
      });
    });
    for (let i = 0; i < counts.length; i++) {
      // Calculate average, handle division by zero 
      const avg = counts[i] > 0 ? sums[i] / counts[i] : 0;
      QAverage[i] = avg;
    }
    console.log("Array of Avg values : ", QAverage);
  }

  return (
    <>
      <div>
        <Form />
        <Background />
        <Home />
        {/* <button onClick={ShowData}>GET DATA</button> */}
        <Footer />
      </div>
    </>
  );
}

export default App;