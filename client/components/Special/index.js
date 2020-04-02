import React from 'react';
import PropTypes from 'prop-types';

import styles from './styles.css';

const LIST = {
  BUG: {
    title: 'QA克星特别奖',
    subTitle: '不要告诉杰哥🤷‍',
    header: ['名次', '芳名', '年度BUG数量', '鼓励金'],
    data: [
      [1, '陈逸凡', 448, 50],
      [2, '郑书婷', 337, 30],
      [3, '耿霄', 255, 20],
    ],
  },
  GOD: {
    title: '修仙特别奖',
    subTitle: '谁还不是小仙女咋滴💅',
    header: ['名次', '芳名', '年度平均日工时', '鼓励金'],
    data: [
      [1, '张迪', 13.4, 50],
      [2, '赵金嵩', 12.7, 30],
      [3, '郑琳琳', 12.5, 20],
    ],
  },
}

function Special(props) {
  const classArr = [];

  if (props.isRolling) {
    classArr.push(styles.isRolling);
  }

  const list = LIST[props.type];

  return (
    <div className={styles.special}>
      <header>
        <h1 className={styles.cup}><span role="img" aria-label="fuck">🏆</span></h1>
        <h2 className={styles.title}>{`🎊 ${list.title} 🎊`}</h2>
        <p>{`“${list.subTitle}”`}</p>
      </header>
      <table>
        <tbody>
          <tr>
            {
              list.header.map((item, index) => (
                <th key={index} align="center">{item}</th>
              ))
            }
          </tr>
          {
            list.data.map((data, index) => (
              <tr key={index}>
                {
                  data.map((item, index) => (
                    <td key={index} align="center">{item}</td>
                  ))
                }
              </tr>
            ))
          }
        </tbody>
        </table>
      </div>
  )
}

Special.propTypes = {
  type: PropTypes.oneOf(['BUG', 'GOD']),
};
Special.defaultProps = {
  type: 'BUG',
};

export default Special;