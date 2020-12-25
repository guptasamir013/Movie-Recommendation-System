import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
//axios Instance ????, Redirect ??????
function Movie(props) {
  function handleClick() {}
  return (
    <div>
      <Card style={{ border: "5px solid black", align: "center" }}>
        {/* <Card.Img variant="top" src="holder.js/100px180?text=Image cap" /> */}
        <Card.Body>
          <Link to={`/movie_detail/${props.movie.id}/`}>
            {props.movie.title}
          </Link>
          {/* <Card.Link href=>{props.movie.title}</Card.Title> */}
          {/* <Card.Text>
            Some quick example text to build on the card title and make up the
            bulk of the card's content.
          </Card.Text> */}
        </Card.Body>
        {/* <Card.Body>
          <Card.Link href="#">Card Link</Card.Link>
          <Card.Link href="#">Another Link</Card.Link>
        </Card.Body> */}
      </Card>
    </div>
  );
}
export default Movie;
