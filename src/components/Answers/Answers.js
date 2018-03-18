// Modified from https://codesandbox.io/s/5z18q98on
import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';

const styles = require('./Answers.scss');

const Answers = ({ answers, onSelect }) => (
  <ul className={styles.list}>
    {answers.map(answer => (
      <li className={styles.button} key={`Answer.answer.${answer._id}`}>
        <Button onClick={() => onSelect(answer)} color="teal" size="massive">
          {answer.text}
        </Button>
      </li>
    ))}
  </ul>
);

Answers.propTypes = {
  answers: PropTypes.arrayOf(PropTypes.object).isRequired,
  onSelect: PropTypes.func.isRequired
};

export default Answers;
