// src/components/ContactUs.js
import React, { useContext, useState } from 'react';
import { authContext } from '../context/AuthContext';

const Contact = () => {
  const {user}=useContext(authContext)
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [review, setReview] = useState('');
  const [rating, setRating] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    // Here you can send the form data to your server or API
    const formData = {
      userId:user._id,
      name,
      email,
      review,
      rating,
    };
    console.log('Submitted Data:', formData);

    try {
      const res =await fetch(`${BASE_URL}/webReview/postReview`,
        {method:'post',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify(formData),
        }
      )

      const result=await res.json()
      
 
      // console.log(res.ok)
      if(!res.ok)
      {
       
        throw new Error(result.message || "something went wrong")
      }

        // console.log("hi"
      toast.success(result.message)

      navigate('/')
      
    } catch (error) {
      
      toast.error(error.message)

      setLoading(false)
    }


  };

  return (
    <>

    <section>
    <div className="contact-us-form">
      {submitted ? (
        <div className="thank-you-message">
          <h2>Thank You for Your Feedback!</h2>
          <p>Your review: {review}</p>
          <p>Your rating: {rating} / 5</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2>Contact Us & Feedback</h2>

          <label>
            Name:
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>
          <br />

          <label>
            Email:
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>
          <br />

          <label>
            Your Review:
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </label>
          <br />

          <label>
            Rating (1-5):
            <select
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              required
            >
              {[1, 2, 3, 4, 5].map((num) => (
                <option key={num} value={num}>
                  {num}
                </option>
              ))}
            </select>
          </label>
          <br />

          <button type="submit" className="w-full bg-orange-400 btn" >Submit</button>
        </form>
      )}
    </div>
    </section>
    </>
  );
};

export default Contact;
