import React, { useEffect } from 'react';
import logo from "../assets/Logo.png";
import { useState } from "react";
import { db } from "./config/FirebaseConfig"; 
import { doc ,setDoc, getDoc, collection } from "firebase/firestore";
import logo2 from "/public/mlsc-vcet.png"

function Home() {

    //Creating reference for the database...
    const teamcodes_ref = doc(db, "team_codes", "team_unique_ids");
    const feedback_ref = collection(db, "team_feedbacks");    
    const team_access_ref = doc(db, "team_codes", "team_access");

    //Required variables...
    const [Q1,setval1] = useState(0);
    const [Q2,setval2] = useState(0);
    const [Q3,setval3] = useState(0);
    const [Q4,setval4] = useState(0);
    const [Q5,setval5] = useState(0);
    const [Q6,setval6] = useState(0);
    const [Q7,setval7] = useState(0);
    const [Q8,setval8] = useState(0);
    const [suggest, setsug] = useState("");

    const [valid_codes, setvalid_codes] = useState([]);
    const [access_data, setaccess_data] = useState([]);
    
    const [teamcode , setcode]  = useState("");    
    const [showdiv, setshowdiv] = useState(false);
    var [teamname, setname] = useState("");

    const GetCodes_info = async () =>{
        const codes = await getDoc(teamcodes_ref);
        setvalid_codes(codes.data());
    }

    const GetAccess_info = async () => {
        const acces = await getDoc(team_access_ref);
        setaccess_data(acces.data());
    }

    useEffect(() => {
        GetCodes_info();
        GetAccess_info();
    }, []);
    
    const ValidCheck =  async() => {
        let notValidFlag = true;
        console.log("\n");
        GetCodes_info();
        GetAccess_info()
        console.log("Valid Codes : ", valid_codes);
        console.log("Access Info : ", access_data);

        Object.keys(valid_codes).forEach(key => {
            if (teamcode === valid_codes[key]) {
                name = key;
                //setname(key);
                console.log("The ", key," has access!", access_data[key]);
                if( access_data[key] === true ) { 
                    setshowdiv(!showdiv); 
                    notValidFlag = false;
                    setname(key);
                }
            }
        });
        if(notValidFlag === true) {
            // toast.success("The Team Code is Invalid!!   !", {
            //     position: toast.POSITION.TOP_CENTER
            //   });
            alert("The team code is Invalid!");
        }
    }

    //Submit button function...
    const Submit = async () => {
        try{
            //collection data as per the team name...
            console.log("Team Name : ", teamname);
            await setDoc(doc(feedback_ref, teamname), { q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5, q6: Q6, q7: Q7, q8: Q8, suggestion: suggest });

            const teamAccessData = (await getDoc(team_access_ref)).data();
            teamAccessData[teamname] = false;
            await setDoc(team_access_ref, teamAccessData);
            
            setshowdiv(!showdiv);
            window.location.reload();
            alert("Feedback submited successfully!!!");
        }
        catch (err) {
            console.log("Error : ",err);
        }
    }


    return (
        <div className='home-page'>
            <div>
                {/* <img src={logo2} alt="Logo" class="logo2" /> */}
                <h1 class="title">MICROSOFT LEARN STUDENTS CLUB</h1>
            </div>

            <div className="logo">
                <img src={logo} alt="Logo" />
            </div>
            
            <div className="heading">
                <span className="welcome">Thank you for participating !</span>
                <br />
                <span className="codefest">Please take a few minutes to share your experience with us. Your feedback is valuable and will help us improve future events.</span>
                <br />
            </div>

            <div className='form-title'>
                FEEDBACK FORM
            </div>
            <div className='form-frame'>
                <div className='form-content'>

                    <div className='question'>
                        <div className="question">
                            Enter your team Code..
                            <br />
                            <input type="text" maxlength="20" onChange={(e) => { setcode(e.target.value)}}/>
                        </div>

                    </div>
                    
                    {showdiv && <div className='starRatings_set1 '>
                    <div className='ques1'>
                        How would you rate the overall organization and logistics of the hackathon?
                        <br />
                        <div className='opspacings'></div>
                        <div className="options">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <span className='stars' key={value} style={{ cursor: 'pointer', marginRight: '30px' }} 
                                onClick={() => setval1(value)}>
                                {Q1 >= value ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                        <br/>
                    </div>

                    <div className='ques2'>
                        How satisfied were you with the venue and facilities provided?
                        <br />
                        <div className='opspacings'></div>
                        <div className="options">
                            {[1, 2, 3, 4, 5].map((value) => (
                                <span className='stars' key={value} style={{ cursor: 'pointer', marginRight: '30px' }}
                                onClick={() => setval2(value)}>
                                { Q2 >= value ? '★' : '☆'}
                                    
                                </span>
                            ))}
                        </div>
                        <br />
                    </div>

                    <div className='ques3'>
                        How well did the hackathon theme align with your interests and expertise?
                        <br />
                        <div className='opspacings'></div>
                        <div className="options">
                        {[1, 2, 3, 4, 5].map((value) => (
                                <span className='stars' key={value} style={{ cursor: 'pointer', marginRight: '30px' }} 
                                onClick={() => setval3(value)}>
                                {Q3 >= value ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                        <br />
                    </div>

                    <div className='ques4'>
                        How satisfied were you with the communication channels and updates throughout the hackathon?
                        <br />
                        <div className='opspacings'></div>
                        <div className="options">
                        {[1, 2, 3, 4, 5].map((value) => (
                                <span className='stars' key={value} style={{ cursor: 'pointer', marginRight: '30px' }} 
                                onClick={() => setval4(value)}>
                                {Q4 >= value ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                        <br />
                    </div>

                    <div className='ques5'>
                        How satisfied were you with the judging criteria and evaluation process?
                        <br />
                        <div className='opspacings'></div>
                        <div className="options">
                        {[1, 2, 3, 4, 5].map((value) => (
                                <span className='stars' key={value} style={{ cursor: 'pointer', marginRight: '30px' }} 
                                onClick={() => setval5(value)}>
                                {Q5 >= value ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                        <br />
                    </div>

                    <div className='ques6'>
                        How well did the hackathon challenge stimulate creativity and innovation?
                        <br />
                        <div className='opspacings'></div>
                        <div className="options">
                        {[1, 2, 3, 4, 5].map((value) => (
                                <span className='stars' key={value} style={{ cursor: 'pointer', marginRight: '30px' }} 
                                onClick={() => setval6(value)}>
                                {Q6 >= value ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                        <br />
                    </div>

                    <div className='ques7'>
                        Rate the fairness and transparency of the judging decisions
                        <br />
                        <div className='opspacings'></div>
                        <div className="options">
                        {[1, 2, 3, 4, 5].map((value) => (
                                <span className='stars' key={value} style={{ cursor: 'pointer', marginRight: '30px'}} 
                                onClick={() => setval7(value)}>
                                {Q7 >= value ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                        <br />
                    </div>

                    <div className='ques8'>
                        Rate your overall satisfaction with the hackathon experience.
                        <br />
                        <div className='opspacings'></div>
                        <div className="options">
                        {[1, 2, 3, 4, 5].map((value) => (
                                <span className='stars' key={value} style={{ cursor: 'pointer', marginRight: '30px' }} 
                                onClick={() => setval8(value)}>
                                {Q8 >= value ? '★' : '☆'}
                                </span>
                            ))}
                        </div>
                        <br />
                    </div>

                    <div className='ques9'>
                        Any suggestions/queries you'd like us to help you with..
                        <br />
                        <br />
                        <input type="text" maxlength="100" onChange={(e) => { setsug(e.target.value)}}/>
                    </div>
                    </div>
                    }
                </div>
            </div>
            {!(showdiv) && <button className='submit' onClick={ValidCheck}>Proceed</button>}
            {(showdiv) && <button className='submit' onClick={Submit}>Submit</button>}
        </div>
    );
}

export default Home;