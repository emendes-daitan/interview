// Modified from https://codesandbox.io/s/5z18q98on
import React from 'react';
import PropTypes from 'prop-types';

const styles = require('./Results.scss');

const Results = ({ results }) => {
  let header = '';
  return (
    <section className={styles.wraper}>
      {results.map(result => {
        let headerContent = '';
        if (header !== result.question.type) {
          headerContent = <h1>{result.type.text}</h1>;
          header = result.question.type;
        }
        return (
          <div key={`Results.result.${result.answer._id}.${result.question._id}`}>
            {headerContent}
            <p className={styles.line}>{`-${result.question.text} R: ${result.answer.text}`}</p>
          </div>
        );
      })}
    </section>
  );
};

Results.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired
};

export default Results;
