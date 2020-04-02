import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

function RollButton(props) {
  const classArr = [styles.rollBtn];

  if (props.isRolling) {
    classArr.push(styles.isRolling);
  }

  return (
    <a
      className={classArr.join(' ')}
      onClick={props.onClick}
    >
      {props.isRolling ? '点我结束' : '点我开始'}
    </a>
  )
}

RollButton.propTypes = {
  isRolling: PropTypes.bool,
};
RollButton.defaultProps = {
  isRolling: false,
};

export default RollButton;