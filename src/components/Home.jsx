import React, { useEffect } from "react";
import Hackathon_logo from "../assets/Logo.png";
import { useState } from "react";
import { db } from "./config/FirebaseConfig";
import { doc, setDoc, getDoc, collection, QueryStartAtConstraint } from "firebase/firestore";
// import mlsc_logo from "../assets/mlsc_logo.png";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


function Home() {
  //Creating reference for the database...
  const teamcodes_ref = doc(db, "team_codes", "team_unique_ids");
  const feedback_ref = collection(db, "team_feedbacks");
  const team_access_ref = doc(db, "team_codes", "team_access");

  //Required variables...
  const [Q1, setval1] = useState(0);
  const [Q2, setval2] = useState(0);
  const [Q3, setval3] = useState(0);
  const [Q4, setval4] = useState(0);
  const [Q5, setval5] = useState(0);
  const [Q6, setval6] = useState(0);
  const [Q7, setval7] = useState(0);
  const [Q8, setval8] = useState(0);
  const [suggest, setsug] = useState("");

  // Separate hovered value state for each question
  const [hoveredValueQ1, setHoveredValueQ1] = useState(0);
  const [hoveredValueQ2, setHoveredValueQ2] = useState(0);
  const [hoveredValueQ3, setHoveredValueQ3] = useState(0);
  const [hoveredValueQ4, setHoveredValueQ4] = useState(0);
  const [hoveredValueQ5, setHoveredValueQ5] = useState(0);
  const [hoveredValueQ6, setHoveredValueQ6] = useState(0);
  const [hoveredValueQ7, setHoveredValueQ7] = useState(0);
  const [hoveredValueQ8, setHoveredValueQ8] = useState(0);

  const [valid_codes, setvalid_codes] = useState([]);
  const [access_data, setaccess_data] = useState([]);

  const [teamcode, setcode] = useState("");
  const [showdiv, setshowdiv] = useState(false);
  var [teamname, setname] = useState("");

  const scrollToBottom = () => {
    window.scrollTo({
      top: document.body.scrollHeight,
      behavior: "smooth",
    });
  };

  const GetCodes_info = async () => {
    const codes = await getDoc(teamcodes_ref);
    setvalid_codes(codes.data());
  };

  const GetAccess_info = async () => {
    const acces = await getDoc(team_access_ref);
    setaccess_data(acces.data());
  };

  useEffect(() => {
    GetCodes_info();
    GetAccess_info();
  }, []);

  const ValidCheck = async () => {
    let notValidFlag = true;
    var TeamcodeNull = false;
    console.log("\n");
    GetCodes_info();
    GetAccess_info();
    console.log("Valid Codes : ", valid_codes);
    console.log("Access Info : ", access_data);

    if (teamcode === "") { 
      TeamcodeNull = true;
      toast.error("Please enter your team code", {
      position: "top-center",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    }); 
  }

    Object.keys(valid_codes).forEach((key) => {
      if (teamcode === valid_codes[key]) {
        name = key;
        //setname(key);
        console.log("The ", key, " has access!", access_data[key]);
        if (access_data[key] === true) {
          setshowdiv(!showdiv);
          notValidFlag = false;
          setname(key);
        }
      }
    });
    if (notValidFlag === true && TeamcodeNull === false ) {
      toast.error("Team code is invalid or you have already filled the form!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const NullCheck_and_Submit = () => {
    
    const Qarray = [ Q1, Q2, Q3, Q4, Q5, Q6, Q7, Q8 ];
    var NullCheckFlag = false;
    for ( var i = 0; i <= 7; i++ ) {
        if (Qarray[i] < 1 || Qarray[i] > 5 ) {
            NullCheckFlag = true;   
        }
    }
    if (NullCheckFlag === true) {
        toast.error("Please attempt all the star ratings questions!", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
    }
    else { Submit(); }
  }

  //Submit button function...
  const Submit = async () => {
    try {
      //collection data as per the team name...
      console.log("Team Name : ", teamname);
      await setDoc(doc(feedback_ref, teamname), {
        q1: Q1,
        q2: Q2,
        q3: Q3,
        q4: Q4,
        q5: Q5,
        q6: Q6,
        q7: Q7,
        q8: Q8,
        suggestion: suggest,
      });

      const teamAccessData = (await getDoc(team_access_ref)).data();
      teamAccessData[teamname] = false;
      await setDoc(team_access_ref, teamAccessData);
      setshowdiv(!showdiv);
      toast.success("Feedback Submitted!!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(() => {
        window.location.reload();
      }, 2300);
      console.log("Done");
    } catch (err) {
      toast.error("Please try again!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      console.log(err);
    }
  };

  return (
    <div className="home-page">
      <div className="image-container"></div>

      <div className="logo">
        <img src={Hackathon_logo} alt="Logo" />
      </div>

      <div>
        <span className="heading">Feedback Form</span><br />
        <span className="welcome">
          Thank you for participating ! Please take a few minutes to share your
          experience with us. Your feedback is valuable and will help us improve
          future events.
        </span>
      </div>

      <button className="scroll-down-button" onClick={scrollToBottom}>
        ↓
      </button>

      <div className="form-title">Your feedback matters!</div>
      <div className="form-frame">
        <div className="form-content">
          <div className="question">
            <div className="question">
              Enter your team name here:
              <br />
              <input
                type="text"
                maxLength="20"
                onChange={(e) => {
                  setcode(e.target.value);
                }}
                class="centered-input"
              />
            </div>
          </div>

          {showdiv && (
            <div className="starRatings_set1 ">
              <div className="ques1">
              Rate your overall satisfaction with the hackathon experience.
                <br />
                <div className="opspacings"></div>
                <div className="options">
                  {[1, 2, 3, 4, 5].map((value) => (
                    // <span
                    //   className="stars"
                    //   key={value}
                    //   style={{ cursor: "pointer", marginRight: "30px" }}
                    //   onClick={() => setval1(value)}
                    // >
                    //   {Q1 >= value ? "★" : "☆"}
                    // </span>
                    <span
                      className="stars"
                      key={value}
                      style={{ cursor: "pointer", marginRight: "30px" }}
                      onMouseEnter={() => setHoveredValueQ1(value)}
                      onMouseLeave={() => setHoveredValueQ1(0)}
                      onClick={() => setval1(value)}

                    >
                    { (hoveredValueQ1 || Q1) >= value ? "★" : "☆" }
                    </span>
                  ))}
                </div>
                <br />
              </div>

              <div className="ques2">
              How satisfied were you with the venue and facilities provided?
                <br />
                <div className="opspacings"></div>
                <div className="options">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <span
                      className="stars"
                      key={value}
                      style={{ cursor: "pointer", marginRight: "30px" }}
                      onMouseEnter={() => setHoveredValueQ2(value)}
                      onMouseLeave={() => setHoveredValueQ2(0)}
                      onClick={() => setval2(value)}
                    >
                      {(hoveredValueQ2 || Q2) >= value ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <br />
              </div>

              <div className="ques3">
              How would you rate the quality and availability of food (breakfast, lunch, dinner, and snacks) during the event?
                <br />
                <div className="opspacings"></div>
                <div className="options">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <span
                      className="stars"
                      key={value}
                      style={{ cursor: "pointer", marginRight: "30px" }}
                      onMouseEnter={() => setHoveredValueQ3(value)}
                      onMouseLeave={() => setHoveredValueQ3(0)}
                      onClick={() => setval3(value)}
                    >
                      {(hoveredValueQ3 || Q3)>= value ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <br />
              </div>

              <div className="ques4">
                
              How effective and supportive were the mentors in guiding participants?
                <br />
                <div className="opspacings"></div>
                <div className="options">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <span
                      className="stars"
                      key={value}
                      style={{ cursor: "pointer", marginRight: "30px" }}
                      onMouseEnter={() => setHoveredValueQ4(value)}
                      onMouseLeave={() => setHoveredValueQ4(0)}
                      onClick={() => setval4(value)}
                    >
                      {(hoveredValueQ4 || Q4) >= value ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <br />
              </div>

              <div className="ques5">
              How fair and insightful was the judging process?

                <br />
                <div className="opspacings"></div>
                <div className="options">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <span
                      className="stars"
                      key={value}
                      style={{ cursor: "pointer", marginRight: "30px" }}
                      onMouseEnter={() => setHoveredValueQ5(value)}
                      onMouseLeave={() => setHoveredValueQ5(0)}
                      onClick={() => setval5(value)}
                    >
                      {(hoveredValueQ5 || Q5) >= value ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <br />
              </div>

              <div className="ques6">
              How well did the hackathon theme align with your interests and
              expertise?
                <br />
                <div className="opspacings"></div>
                <div className="options">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <span
                      className="stars"
                      key={value}
                      style={{ cursor: "pointer", marginRight: "30px" }}
                      onMouseEnter={() => setHoveredValueQ6(value)}
                      onMouseLeave={() => setHoveredValueQ6(0)}
                      onClick={() => setval6(value)}
                    >
                      {(hoveredValueQ6 || Q6) >= value ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <br />
              </div>

              <div className="ques7">
              How well did the hackathon challenge stimulate creativity and
                innovation?
                <br />
                <div className="opspacings"></div>
                <div className="options">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <span
                      className="stars"
                      key={value}
                      style={{ cursor: "pointer", marginRight: "30px" }}
                      onMouseEnter={() => setHoveredValueQ7(value)}
                      onMouseLeave={() => setHoveredValueQ7(0)}
                      onClick={() => setval7(value)}
                    >
                      {(hoveredValueQ7 || Q7) >= value ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <br />
              </div>

              <div className="ques8">
              How would you rate the organization and logistics of the
              hackathon?
                <br />
                <div className="opspacings"></div>
                <div className="options">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <span
                      className="stars"
                      key={value}
                      style={{ cursor: "pointer", marginRight: "30px" }}
                      onMouseEnter={() => setHoveredValueQ8(value)}
                      onMouseLeave={() => setHoveredValueQ8(0)}
                      onClick={() => setval8(value)}
                    >
                      {(hoveredValueQ8 || Q8) >= value ? "★" : "☆"}
                    </span>
                  ))}
                </div>
                <br />
              </div>

              <div className="ques9">
                Any suggestions/queries you'd like us to help you with..
                <br />
                <br />
                <input
                  type="text"
                  maxlength="100"
                  onChange={(e) => {
                    setsug(e.target.value);
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {!showdiv && (
        <button className="submit" onClick={ValidCheck}>
          Proceed
        </button>
      )}
      {showdiv && (
        <button className="submit" onClick={NullCheck_and_Submit}>
          Submit
        </button>
      )}
      <ToastContainer
        position="top-center"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default Home;