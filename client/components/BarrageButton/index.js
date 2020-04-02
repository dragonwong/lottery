import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

function BarrageButton(props) {
  const classArr = [styles.barrageButton];

  if (props.disabled) {
    classArr.push(styles.disabled);
  }

  return (
    <a
      className={classArr.join(' ')}
      onClick={props.onClick}
    >发送弹幕</a>
  );
}

BarrageButton.propTypes = {
  disabled: PropTypes.bool,
};
BarrageButton.defaultProps = {
  disabled: false,
};

export default BarrageButton;