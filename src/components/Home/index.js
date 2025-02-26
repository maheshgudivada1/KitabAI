import React, { useEffect, useState } from 'react';
import { GoogleLogin, googleLogout } from '@react-oauth/google';
import { FaMicrophone } from 'react-icons/fa'; // Using react-icons for the mic icon
import './index.css'; // Import the CSS file
import Header from '../Header';
import CarouselControlled from '../Carousel';
import { useScroll } from "framer-motion";
import { HiOutlineChatBubbleLeftEllipsis } from "react-icons/hi2";
import Footer from '../Footer';
import 'bootstrap/dist/css/bootstrap.min.css';

const booksData = [
  // UPSC Books
  {
    id: 1,
    title: "Indian Polity",
    author: "M. Laxmikanth",
    publisher: "McGraw Hill",
    type: "UPSC",
    imageUrl: "https://m.media-amazon.com/images/I/71CrTyKsazL._AC_UF1000,1000_QL80_.jpg", // replace with actual static image later
    description: "A comprehensive guide to Indian polity, covering the Indian Constitution and political system.",
  },
  {
    id: 2,
    title: "Economic Survey of India",
    author: "Ministry of Finance",
    publisher: "Government of India",
    type: "UPSC",
    imageUrl: "https://m.media-amazon.com/images/I/810q9gZT+VL.jpg",
    description: "A yearly publication providing a detailed analysis of the Indian economy.",
  },
  {
    id: 3,
    title: "Certificate Physical and Human Geography",
    author: "G.C. Leong",
    publisher: "Oxford University Press",
    type: "UPSC",
    imageUrl: "https://m.media-amazon.com/images/I/912vU-UabHL._AC_UF1000,1000_QL80_.jpg",
    description: "A well-known book for mastering the concepts of physical and human geography.",
  },
  {
    id: 4,
    title: "General Studies Paper 1",
    author: "M. K. Pandey",
    publisher: "McGraw Hill",
    type: "UPSC",
    imageUrl: "https://qph.cf2.quoracdn.net/main-qimg-35b9de8e71eae1c34623e096e4041ffc-lq",
    description: "A popular book for preparing for general studies paper 1 (prelims), covering history, geography, and more.",
  },
  {
    id: 5,
    title: "Modern India",
    author: "Bipin Chandra",
    publisher: "Orient BlackSwan",
    type: "UPSC",
    imageUrl: "https://orientblackswan.com/bigcovers/9789390122554.jpg",
    description: "A thorough book on the modern history of India, ideal for UPSC Civil Services.",
  },
  {
    id: 6,
    title: "Indian Art and Culture",
    author: "Nitin Singhania",
    publisher: "Spectrum",
    type: "UPSC",
    imageUrl: "https://m.media-amazon.com/images/I/81iYoWTZ3nL._AC_UF1000,1000_QL80_.jpg",
    description: "A well-structured book covering various aspects of Indian art and culture for the UPSC exam.",
  },
  {
    id: 7,
    title: "Environment and Ecology",
    author: "Majid Husain",
    publisher: "McGraw Hill",
    type: "UPSC",
    imageUrl: "https://m.media-amazon.com/images/I/7182jGsCODL._AC_UF1000,1000_QL80_.jpg",
    description: "A concise book focusing on environmental science and ecology, important for UPSC prelims.",
  },
  {
    id: 8,
    title: "Geography of India",
    author: "Majid Husain",
    publisher: "McGraw Hill",
    type: "UPSC",
    imageUrl: "https://m.media-amazon.com/images/I/71+CGSIFKKL._AC_UF1000,1000_QL80_.jpg",
    description: "A detailed guide to the geographical aspects of India, with maps and diagrams.",
  },
  {
    id: 9,
    title: "NCERT (6th-12th) for General Studies",
    author: "Shasank Shajwan",
    publisher: "NCERT",
    type: "UPSC",
    imageUrl: "https://m.media-amazon.com/images/I/71px1HNKCcL._AC_UF1000,1000_QL80_.jpg",
    description: "Basic and essential books that help in building the foundation for various topics in UPSC.",
  },
  {
    id: 10,
    title: "The India Yearbook",
    publisher: "Government of India",
    author: "Government",
    type: "UPSC",
    imageUrl: "https://m.media-amazon.com/images/I/8114nckFdcL._AC_SX148_SY213_QL70_.jpg",
    description: "A go-to resource for current affairs, government schemes, and economic statistics.",
  },

  // JEE Books
  {
    id: 11,
    title: "Concepts of Physics",
    author: "H.C. Verma",
    publisher: "Bharati Bhawan",
    type: "JEE",
    imageUrl: "https://bookwindow.in/assets/images/image/uploads/1513759421buy-bharati-bhawan-concepts-of-physics-part-1-h-c-verma-online.png",
    description: "A must-have for understanding fundamental concepts of physics, widely recommended for JEE preparation.",
  },
  {
    id: 12,
    title: "Organic Chemistry",
    author: "Morrison & Boyd",
    publisher: "Pearson",
    type: "JEE",
    imageUrl: "https://m.media-amazon.com/images/I/81OXEahW1UL.jpg",
    description: "This book provides a detailed approach to organic chemistry, useful for JEE aspirants.",
  },
  {
    id: 13,
    title: "IIT Chemistry",
    author: "O.P. Tandon",
    publisher: "Grada",
    type: "JEE",
    imageUrl: "https://m.media-amazon.com/images/I/517Io-YyrKL._AC_UF1000,1000_QL80_.jpg",
    description: "A thorough reference for organic, inorganic, and physical chemistry topics for JEE.",
  },
  {
    id: 14,
    title: "Problems in General Physics",
    author: "I.E. Irodov",
    publisher: "Arihant",
    type: "JEE",
    imageUrl: "https://m.media-amazon.com/images/I/51L5I0zZLbL.jpg",
    description: "This book is known for its challenging problems and covers all physics topics for JEE.",
  },
  {
    id: 15,
    title: "Mathematics for Class 11 & 12",
    author: "R.D. Sharma",
    publisher: "Dhanpat Rai",
    type: "JEE",
    imageUrl: "https://images-eu.ssl-images-amazon.com/images/I/A1-Q5f4tGGL._AC_UL600_SR600,600_.jpg",
    description: "Covers all concepts needed for JEE mathematics preparation, from basic to advanced.",
  },

  // NEET Books
  {
    id: 16,
    title: "Physical Chemistry",
    author: "O.P. Tandon",
    publisher: "Grada",
    type: "NEET",
    imageUrl: "https://grbathla.com/wp-content/uploads/2020/10/Physical-new-image-vol-1.jpg",
    description: "A complete guide for NEET chemistry preparation with problems and theory.",
  },
  {
    id: 17,
    title: "Biology",
    author: "Trueman",
    publisher: "Trueman",
    type: "NEET",
    imageUrl: "https://m.media-amazon.com/images/I/71zBO5rMjOL._AC_UF350,350_QL80_.jpg",
    description: "A comprehensive book covering all aspects of biology for NEET.",
  },
  {
    id: 18,
    title: "Objective Biology",
    author: "Dinesh",
    publisher: "Dinesh",
    type: "NEET",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqjd26RODvhDAQ3mjYlRt2JBoI_pSxmi9SDg&s",
    description: "Well-structured for NEET, with objective questions for better practice.",
  },
  {
    id: 19,
    title: "Human Physiology",
    author: "C.L. Ghai",
    publisher: "Elsevier",
    type: "NEET",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQTzYB800AH2OUU7CPDBErgEZjKPZhGzSC6wQ&s",
    description: "A textbook that covers human physiology in detail, necessary for NEET.",
  },

  // SSC Books
  {
    id: 20,
    title: "SSC CGL Previous Year Solved Papers",
    publisher: "Kiran Prakashan",
    author: "Kiran",
    type: "SSC",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ4TEEIOdegkc2TMSThhPIDYDG0sTclkND_Pw&s",
    description: "A collection of previous years' questions to help prepare for SSC CGL exams.",
  },
  {
    id: 21,
    title: "Quantitative Aptitude for Competitive Exams",
    author: "R.S. Aggarwal",
    publisher: "S. Chand",
    type: "SSC",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ6ybx3JevfYh6JOXAoyc3DDDgHsnh-mjOA-w&s",
    description: "A popular book that focuses on quantitative aptitude for SSC aspirants.",
  },
  {
    id: 22,
    title: "General English for Competitive Exams",
    author: "Wren & Martin",
    publisher: "S. Chand",
    type: "SSC",
    imageUrl: "https://m.media-amazon.com/images/I/71lXzgyZPZL._AC_UF350,350_QL80_.jpg",
    description: "A comprehensive grammar book for English, essential for SSC exams.",
  },

  // NET Books
  {
    id: 23,
    title: "NTA UGC NET General Paper 1",
    author: "Arihant Experts",
    publisher: "Arihant",
    type: "NET",
    imageUrl: "https://images.meesho.com/images/products/228910692/sfqyc_512.webp",
    description: "A guidebook to help in understanding General Paper 1 for UGC NET.",
  },
  {
    id: 24,
    title: "UGC NET Paper 2 Political Science",
    author: "K. K. Aziz",
    publisher: "Arihant",
    type: "NET",
    imageUrl: "https://m.media-amazon.com/images/I/61oQA6thVGL._AC_UF1000,1000_QL80_.jpg",
    description: "A complete study resource for Political Science Paper 2 for NET.",
  },

  // School Books (Class 10th and 12th)
  {
    id: 25,
    title: "Mathematics for Class 10",
    author: "R.D. Sharma",
    publisher: "Dhanpat Rai",
    type: "School",
    imageUrl: "https://5.imimg.com/data5/SELLER/Default/2021/4/YB/DG/KS/74642511/rd-sharma-mathematics-for-class-10.jpg",
    description: "A comprehensive guide for Class 10 mathematics, covering all chapters.",
  },
  {
    id: 26,
    title: "Science for Class 10",
    publisher: "Laxmi Publications",
    author: "Laxmi",
    type: "School",
    imageUrl: "https://raajkart.com/media/catalog/product/cache/378cf9a83101843e5b8b1271b991c285/l/a/laxmi_comprehensive_science_activities_vol_1_for_class_10.jpg",
    description: "A detailed book for science (Physics, Chemistry, Biology) for Class 10 students.",
  },
  {
    id: 27,
    title: "Physics for Class 12",
    author: "H.C. Verma",
    publisher: "Bharati Bhawan",
    type: "School",
    imageUrl: "https://images-eu.ssl-images-amazon.com/images/I/81wUz2-L7fL._AC_UL210_SR210,210_.jpg",
    description: "A popular book covering Physics for Class 12, useful for both board exams and competitive exams.",
  },
  {
    id: 28,
    title: "Chemistry for Class 12",
    author: "O.P. Tandon",
    publisher: "Grada",
    type: "School",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfVdBIxnNITLwvvlc0781AHvhiwJ8EcYMbaw&s",
    description: "Covers the theory and practical aspects of Chemistry for Class 12.",
  },
  {
    id: 29,
    title: "NCERT Mathematics (6th to 12th)",
    publisher: "NCERT",
    type: "School",
    imageUrl: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSEvrN8PgM0ZIJtkRA3budyjAkV_hufg6jfuQ&s",
    description: "NCERT books for a solid foundation in Mathematics for school students.",
  },
];

const testimonials = [
  {
    name: 'Samarjeet Tripathi',
    title: 'UPSC Aspirant',
    description: `Navigating the complexities of UPSC preparation was daunting until I started using KitabAI. 
      The AI’s support in managing study resources and delivering prompt feedback has made my study sessions more productive and less stressful.`,
  },
  {
    name: 'Shashank Sharma',
    title: 'District Judge',
    description: `The impact of KitabAI on our legal education has been profound. Its advanced AI features offer seamless access to essential legal knowledge 
      and provide tailored support, significantly enhancing the learning experience for both educators and students.`,
  },
  {
    name: 'Priya Singh',
    title: 'Author, Spiritual Mentor',
    description: `KitabAI has brought a new dimension to my spiritual teachings. The AI’s ability to make lessons interactive and personalized aligns perfectly with 
      my approach, offering deeper insights and a richer experience for my students.`,
  },
  {
    name: 'Devendra Singh Bahadur',
    title: 'Educationist, Technology Leader, MNC',
    description: `As someone deeply involved in education and technology, I’m impressed by how KitabAI integrates seamlessly into the learning process.`,
  },
  {
    name: 'Birbal Jha',
    title: 'English Trainer',
    description: `KitabAI is a game-changer in education. With its AI voice assistant, the teacher-to-student ratio effectively becomes 1:1, providing a personalized learning experience.`,
  },
  {
    name: 'Indresh Rao',
    title: 'UPSC Faculty',
    description: `Incorporating KitabAI into our UPSC coaching has been a game-changer. The AI assistant's ability to provide personalized guidance and manage vast study materials efficiently 
      has made our preparation process far more organized and effective.`,
  }, {
    name: 'Samarjeet Tripathi',
    title: 'UPSC Aspirant',
    description: `Navigating the complexities of UPSC preparation was daunting until I started using KitabAI. 
      The AI’s support in managing study resources and delivering prompt feedback has made my study sessions more productive and less stressful.`,
  },
  {
    name: 'Shashank Sharma',
    title: 'District Judge',
    description: `The impact of KitabAI on our legal education has been profound. Its advanced AI features offer seamless access to essential legal knowledge 
      and provide tailored support, significantly enhancing the learning experience for both educators and students.`,
  },
  {
    name: 'Priya Singh',
    title: 'Author, Spiritual Mentor',
    description: `KitabAI has brought a new dimension to my spiritual teachings. The AI’s ability to make lessons interactive and personalized aligns perfectly with 
      my approach, offering deeper insights and a richer experience for my students.`,
  },
  {
    name: 'Devendra Singh Bahadur',
    title: 'Educationist, Technology Leader, MNC',
    description: `As someone deeply involved in education and technology, I’m impressed by how KitabAI integrates seamlessly into the learning process.`,
  },
  {
    name: 'Birbal Jha',
    title: 'English Trainer',
    description: `KitabAI is a game-changer in education. With its AI voice assistant, the teacher-to-student ratio effectively becomes 1:1, providing a personalized learning experience.`,
  },
  {
    name: 'Indresh Rao',
    title: 'UPSC Faculty',
    description: `Incorporating KitabAI into our UPSC coaching has been a game-changer. The AI assistant's ability to provide personalized guidance and manage vast study materials efficiently 
      has made our preparation process far more organized and effective.`,
  },
];

const Home = () => {
  const [selectedType, setSelectedType] = useState('UPSC');
  const [showSignIn, setShowSignIn] = useState(false); // Controls whether the Google Sign-In modal is shown
  const [isModalOpen, setIsModalOpen] = useState(false); // Controls modal visibility
  const [loginStatus, setLoginStatus] = useState(null); // Track login status
  const [user, setUser] = useState(null); // Store user data after login
  const [hasLoginAttempted, setHasLoginAttempted] = useState(false); // Track if login attempt was made

  const { scrollYProgress } = useScroll();

  const handleWhatsAppClick = () => {
    const phoneNumber = '8147540362 '; // Replace with the actual number
    const message = 'Hello! I would like to get in touch.'; // Optional predefined message
    const whatsappLink = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(message)}`;
    window.open(whatsappLink, '_blank');
  };
  // Handle sign-up button click
  const handleSignUpClick = () => {
    setShowSignIn(true); // Show Google Sign-In modal when Sign-Up is clicked
    setIsModalOpen(true); // Open modal
  };

  // Handle successful login
  const handleLoginSuccess = (response) => {
    console.log('Login Success:', response);
    setUser(response); // Set the user data
    setLoginStatus('success');
    setHasLoginAttempted(true); // Set login attempt status
    setIsModalOpen(false); // Close modal immediately after successful login
  };

  // Handle login failure
  const handleLoginFailure = (error) => {
    console.log('Login Failed:', error);
    setLoginStatus('failure');
    setHasLoginAttempted(true); // Set login attempt status
    setTimeout(() => setIsModalOpen(false), 2000); // Close modal after a delay
  };

  // Handle logout
  const handleLogout = () => {
    googleLogout();
    setUser(null); // Reset user data
    setLoginStatus(null); // Reset login status
  };

  const filterBooks = booksData.filter((book) => book.type === selectedType);
  const redirectToPlayStore = () => {
    window.open('https://play.google.com/store', '_blank'); // Replace with your Play Store link
  };

  useEffect(() => {
    window.addEventListener('scroll', () => {
      const header = document.querySelector('.header');
      if (window.scrollY > 50) {
        header.style.backdropFilter = 'blur(15px)';
      } else {
        header.style.backdropFilter = 'blur(10px)';
      }
    });
  }, []);

  return (
    <div className="home-page-container">
      {/* Scroll Progress Bar */}
      <div className="home-page">
        <Header />

        <div className="content-left">
          <h1 className="main-heading">
            <span className="site-heading" style={{ fontSize: '50px' }}>KitabAI</span> <br />
            Talk to Your Books, Powered by AI
          </h1>
          <p className="sub-heading">
            Empowering Books with AI: Instant Answers, Real-Time Conversations, and Personalized Learning
          </p>
          <div className='buttons-container'>
            {/* Conditionally render the Sign Up button only if the user is not logged in */}
            {!user && (
              <button onClick={handleSignUpClick} className="signUp-button button">Sign Up</button>
            )}
            <button className="getIn-touch-button button" onClick={handleWhatsAppClick}>
              Get In Touch
            </button>
          </div>
          <button className="playstore-button" onClick={redirectToPlayStore}>
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Play Store"
              className="playstore-icon"
            />
          </button>

          {/* Conditionally render Google Login if showSignIn is true */}

        </div>

        <div className="content-right">
          <CarouselControlled />
        </div>
      </div>
      <div className="book-filter-container">
        <div className="filter-buttons">
          {['UPSC', 'JEE', 'NEET', 'SSC', 'NET', 'School', 'Language'].map((type) => (
            <button
              key={type}
              className={`filter-button ${selectedType === type ? 'active' : ''}`}
              onClick={() => setSelectedType(type)}
            >
              {type}
            </button>
          ))}
        </div>


        <div className="container mt-5">
          <div className="row">
            {filterBooks.map((book, index) => (
              <div
                key={book.id}
                className={`col-12 mb-4 ${index % 2 === 0 ? '' : 'flex-row-reverse'} d-flex flex-wrap`}
                style={{ alignItems: 'center', transition: 'all 0.3s ease' }}
              >
                <div className="col-12 col-md-4 mb-3 mb-md-0">
                  <img
                    src={book.imageUrl}
                    alt={book.title}
                    className="img-fluid rounded"
                    style={{
                      width: '100%',
                      height: '450px',
                      transition: 'transform 0.3s ease',
                    }}
                  />
                </div>
                <div className="col-12 col-md-8" style={{ padding: '0 20px' }}>
                  <h2 className="mb-3" style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#333', transition: 'color 0.3s ease' }}>
                    {book.title}
                  </h2>
                  <p className="mb-2" style={{ fontSize: '1.2rem', color: '#555' }}>
                    <strong>Author:</strong> {book.author}
                  </p>
                  <p className="mb-2" style={{ fontSize: '1.2rem', color: '#555' }}>
                    <strong>Publisher:</strong> {book.publisher}
                  </p>
                  <p className="mb-4" style={{ fontSize: '1rem', color: '#777' }}>
                    {book.description}
                  </p>
                  <div className="d-flex justify-content-center gap-3">
                    <button className="btn btn-warning talk-button" style={{ transition: 'background-color 0.3s ease' }}>
                      <FaMicrophone />
                      <span className="ms-2">Click to Talk</span>
                    </button>
                    <button className="btn btn-success chat-button" style={{ transition: 'background-color 0.3s ease' }}>
                      <HiOutlineChatBubbleLeftEllipsis />
                      <span className="ms-2">Click to Chat</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>






      </div>



      <div className="testimonials-container">

        <h3 className="testimonials-heading">Testimonials</h3>
        <div className="carousel-container">
          <div className="carousel-track">
            <div className="carousel-slide">
              {testimonials.map((testimonial, index) => (
                <div key={index} className="testimonial">
                  <h2 className="testimonial-name">{testimonial.name}</h2>
                  <h4 className="testimonial-title">{testimonial.title}</h4>
                  <p className="testimonial-description">{testimonial.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Footer />
        <hr />
        <h4>© 2024 KitabAI. All Rights Reserved.</h4>
      </div>



      {/* Modal for Login */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button className="close-button" onClick={() => setIsModalOpen(false)}>X</button>

            {hasLoginAttempted ? (
              <>
                <h2>{loginStatus === 'success' ? 'Login Successful!' : 'Login Failed'}</h2>
                <p>{loginStatus === 'success' ? 'You have successfully logged in.' : 'There was an error logging in. Please try again.'}</p>
              </>
            ) : (
              <h2>Sign In</h2>
            )}

            <GoogleLogin
              onSuccess={handleLoginSuccess}
              onError={handleLoginFailure}
              useOneTap
              size="large"
              shape="pill"
              width="auto"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default Home;
