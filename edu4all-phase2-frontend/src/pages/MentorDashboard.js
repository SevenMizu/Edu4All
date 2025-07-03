// src/components/MentorDashboard.jsx
import { useEffect, useState } from "react";
import { Card, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import StickyNavbar from "../components/StickyNavbar";
import afternoon from "../resources/afternoon.png";
import evening from "../resources/evening.png";
import morning from "../resources/morning.png";

export default function MentorDashboard() {
  const navigate = useNavigate();
  const [greetingIcon, setGreetingIcon] = useState(morning);
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
      setGreetingIcon(morning);
    } else if (hour < 18) {
      setGreeting("Good afternoon");
      setGreetingIcon(afternoon);
    } else {
      setGreeting("Good evening");
      setGreetingIcon(evening);
    }
  }, []);

  const cards = [
    {
      title: "Manage Sessions",
      text: "View and manage all the sessions you host.",
      btnText: "View Sessions",
      onClick: () => navigate("/dashboard/sessions"),
    },
    {
      title: "Upload Resources",
      text: "Upload new study materials and resources.",
      btnText: "Upload Now",
      onClick: () => navigate("/dashboard/upload-resource"),
    },
    {
      title: "Manage Resources",
      text: "Edit or delete existing resources you’ve uploaded.",
      btnText: "Manage Now",
      onClick: () => navigate("/dashboard/manage-resources"),
    },
    {
      title: "Discussion Forum",
      text: "Join discussions, answer questions, and share knowledge.",
      btnText: "Enter Forum",
      onClick: () => navigate("/dashboard/mentor/forum"),
    },
  ];

  return (
    <>
      <div className="ocean">
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
      <StickyNavbar />
      <div className="container py-5">
        <h2 className="mb-4 capitalize">
          <img className="greetIcon" src={greetingIcon} width={80} alt="" />
          {greeting}, {localStorage.getItem("userName")}!
        </h2>

        <div className="row g-4 mt-5">
          {cards.map((c, i) => (
            <Col key={i} md={3}>
              <Card className="h-100 shadow-sm">
                <Card.Body className="d-flex flex-column">
                  <Card.Title>{c.title}</Card.Title>
                  <Card.Text className="flex-grow-1">{c.text}</Card.Text>
                  <button className="btn btn-primary mt-3" onClick={c.onClick}>
                    {c.btnText}
                  </button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </div>
      </div>
    </>
  );
}
