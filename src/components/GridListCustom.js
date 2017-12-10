import React from 'react';
//import LazyLoad from 'react-lazyload';

import { GridList } from 'material-ui/GridList';
import Subheader from 'material-ui/Subheader';
import styles from '../styles';

function GridListCustom(Component) {
  return props => {
    if (props.data !== null) {
      return (
        <div style={styles.gridListContainer}>
          <GridList cellHeight={180} style={styles.gridList}>
            <Subheader>{props.header}</Subheader>
            {Object.keys(props.data)
              .reverse()
              .map((key, index) => {
                let tile = props.data[key];
                return (
                  <Component {...props} image={tile} key={key} keyProp={key} />
                );
              })}
          </GridList>
        </div>
      );
    } else {
      return (
        <div style={styles.gridListContainer}>
          You didn't upload any element yet!
        </div>
      );
    }
  };
}
export default GridListCustom;
