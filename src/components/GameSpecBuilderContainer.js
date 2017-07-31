import React from 'react';

import styles from '../styles';
import constants from '../constants';
import { boardImagesDbRef, otherImagesDbRef } from '../firebase';
import BoardList from './gamespec/BoardList';
import GameSpecBuilder from './GameSpecBuilder';


import RaisedButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {
  Step,
  Stepper,
  StepLabel,
} from 'material-ui/Stepper';

class GameSpecBuilderContainer extends React.Component {
  state = {
    boardImages: [],
    otherImages: [],
    selectedBoard: "",
    stepIndex: 0,
    finished: false,
    shouldDisplayWarningSnackBar: false

  };
  vars = {
    pieceImageSize: 50,
    snackbarWarning: ''
  };

  componentDidMount() {
    let that = this;
    boardImagesDbRef.once('value').then(function (data) {
      that.setState({
        boardImages: data.val()
      });
    });

    otherImagesDbRef.once('value').then(function (data) {
      that.setState({
        otherImages: data.val()
      });
    });
  }

  notify = (message) => {
    this.vars.snackbarWarning = message;
    this.setState({shouldDisplayWarningSnackBar: true});
  }

  updateStepIndex(stepIndex) {
    this.setState({
      stepIndex: stepIndex + 1,
      finished: stepIndex >= 1
    });
  }

  handleGridTileClickBoard(key) {
    this.setState({
      selectedBoard: key
    });
  }

  getStepContent(stepIndex) {
    switch (stepIndex) {
      case 0: {
        return (
          <div>
            <TextField
              floatingLabelText={constants.PIECE_SIZE_FLOATING_LABEL}
              floatingLabelFixed={true}
              hintText={constants.PIECE_SIZE_HINT_TEXT}
              onChange={(e, newValue) => {
                this.vars.pieceImageSize = newValue}}/>
            <BoardList
              cellHeight={180}
              header="Boards"
              handleGridTileClick={this.handleGridTileClickBoard.bind(this)}
              data={this.state.boardImages}
              selectedKey={this.state.selectedBoard}/>
          </div>
        );
      }

      case 1: {
        return (
          <GameSpecBuilder
            pieceImageSize={this.vars.pieceImageSize}
            images={this.state.otherImages}
            boardImage={this.state.boardImages[this.state.selectedBoard]}/>
        );
      }

      default: {
        break;
      }
    }
  }

  handlePrev = () => {
    const { stepIndex } = this.state;
    if (stepIndex > 0) {
      this.setState({stepIndex: stepIndex - 1});
    }
  };

  handleNext = () => {
    const { stepIndex } = this.state;
    if (stepIndex === 0) {
      if (!this.state.selectedBoard.length) {
        this.notify("You must select a board");
        return;
      }
      this.updateStepIndex(stepIndex);
    } else {
      this.updateStepIndex(stepIndex);
    }
  }

  render() {
    const { stepIndex, finished } = this.state;
    return (
      <div style={{...styles.container}}>
        <Snackbar
          open={this.state.shouldDisplayWarningSnackBar}
          message={this.vars.snackbarWarning}
          autoHideDuration={4000}
          onRequestClose={(e) => {
            this.setState({shouldDisplayWarningSnackBar: false})
          }}/>
        <Stepper activeStep={stepIndex} style={{...styles.container, ...styles.containerWidth700}}>
          <Step>
            <StepLabel>Select the board</StepLabel>
          </Step>
          <Step>
            <StepLabel>Build game specification</StepLabel>
          </Step>
          <Step>
            <StepLabel>Check generated spec</StepLabel>
          </Step>
        </Stepper>
        <div style={styles.content}>
          {finished ? (
            <div>
                <RaisedButton label="Reset" primary={true}
                  onClick={(event) => {
                    event.preventDefault();;
                    this.setState({stepIndex: 0, finished: false});
                  }}/>
            </div>
          ) : (
            <div>
              <div style={{overflowY: 'auto'}}>{this.getStepContent(stepIndex)}</div>
              <div style={{marginTop: 12}}>
                <FlatButton
                  label="Back"
                  disabled={stepIndex === 0}
                  onTouchTap={this.handlePrev}
                  style={{marginRight: 12}}
                />
                <RaisedButton
                  label={stepIndex === 1 ? 'Upload' : 'Next'}
                  primary={true}
                  onTouchTap={this.handleNext}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

export default GameSpecBuilderContainer;
