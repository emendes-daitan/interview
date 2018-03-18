import React, { Component } from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import { provideHooks } from 'redial';
import { connect } from 'react-redux';
import { Button } from 'semantic-ui-react';
import reducerQuestion, * as questionActions from 'redux/modules/question';
import reducerAnswer, * as answerActions from 'redux/modules/answer';
import reducerType, * as typeActions from 'redux/modules/type';
import Question from '../../components/Question/Question';
import Answers from '../../components/Answers/Answers';
import Results from '../../components/Results/Results';

const styles = require('./Feedback.scss');

@provideHooks({
  fetch: async ({ store: { dispatch, getState, inject } }) => {
    inject({ question: reducerQuestion, answer: reducerAnswer, type: reducerType });

    const state = getState();

    if (state.online) {
      dispatch(questionActions.load()).catch(() => null);
      dispatch(typeActions.load()).catch(() => null);
      return dispatch(answerActions.load()).catch(() => null);
    }
  }
})
@connect(state => ({
  questions: state.question.questions,
  answers: state.answer.answers,
  types: state.type.types
}))
export default class Feedback extends Component {
  static propTypes = {
    questions: PropTypes.arrayOf(PropTypes.object),
    types: PropTypes.arrayOf(PropTypes.object),
    answers: PropTypes.arrayOf(PropTypes.object)
  };

  static defaultProps = {
    questions: [],
    answers: [],
    types: []
  };

  constructor(props) {
    super(props);
    let questions = [];
    questions = props.types.length && props.questions.filter(question => question.type === props.types[0].type);
    console.log('questions', questions);
    this.state = {
      currentQuestion: 0,
      currentType: 0,
      questions,
      results: []
    };
  }

  onSelect(answer) {
    const results = [...this.state.results];
    results.push({
      answer,
      type: this.props.types[this.state.currentType],
      question: this.state.questions[this.state.currentQuestion]
    });
    const currentQuestion = this.state.currentQuestion + 1;
    if (currentQuestion === this.state.questions.length) {
      this.changeType();
      this.setState({ results });
    } else {
      this.setState({ currentQuestion, results });
    }
  }

  onSkip() {
    const currentQuestion = this.state.currentQuestion + 1;
    if (currentQuestion === this.state.questions.length) {
      this.changeType();
    } else {
      this.setState({ currentQuestion });
    }
  }

  changeType() {
    const currentType = this.state.currentType + 1;
    const currentQuestion = 0;
    let questions = [];
    if (currentType !== this.props.types.length) {
      questions =
        this.props.types.length &&
        this.props.questions.filter(question => question.type === this.props.types[currentType].type);
    }
    this.setState({ currentType, currentQuestion, questions });
  }
  render() {
    const { answers, types } = this.props;
    const {
      currentQuestion, currentType, questions, results
    } = this.state;

    const show = currentType !== types.length;
    console.log('currentQuestion', currentQuestion);
    console.log('questions.length', questions.length);
    const content = show ? (
      <div className={styles.container}>
        <Helmet title="Feedback" />
        <h1>{types[currentType].text}</h1>
        {currentQuestion !== questions.length && (
          <div>
            <Question
              key={`Question.${currentType}.${questions[currentQuestion]._id}`}
              question={questions[currentQuestion]}
            />
            <Answers answers={answers} onSelect={answer => this.onSelect(answer)} />
          </div>
        )}
        <Button onClick={() => this.onSkip()} className={styles.button} color="orange" size="massive">
          Pular Pergunta
        </Button>
        <Button onClick={() => this.changeType()} className={styles.button} color="purple" size="massive">
          Pular Tema
        </Button>
      </div>
    ) : (
      <div className="container">
        <Results results={results} />
      </div>
    );
    console.log('RESULTS', results);
    return content;
  }
}
