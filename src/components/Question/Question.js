// Modified from https://codesandbox.io/s/5z18q98on
import React from 'react';
import PropTypes from 'prop-types';

const styles = require('./Question.scss');

const Question = ({ question }) => <h1 className={styles.text}>{question.text}</h1>;

Question.propTypes = {
  question: PropTypes.shape({
    _id: PropTypes.string,
    text: PropTypes.string
  }).isRequired
};

export default Question;
