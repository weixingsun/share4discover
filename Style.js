import React from "react-native";
import Dimensions from "Dimensions";

const x = Dimensions.get('window').width;
const y = Dimensions.get('window').height;

const ratioX = x<375 ?(x<320?0.75:0.875):1;
const ratioY = y<568 ?(y<480?0.75:0.875):1;

const base_unit = 16;
const unit = base_unit *ratioX;
const HEADER_HEIGHT = 80;

function em(value){
  return unit * value;
}

export default Style = {
  //General
  DEVICE_WIDTH:x,
  DEVICE_HEIGHT:y,
  RATIO_X:ratioX,
  RATIO_Y:ratioY,
  UNIT:em(1),
  PADDING: em(1.25),
  
  //Card
  CARD_WIDTH: x-em(1.25)*2,
  CARD_HEIGHT: (y-em(1.25)*2-HEADER_HEIGHT),
  CARD_PADDING_TOP: em(1.875)+30,
  CARD_PADDING_X: em(1.875),
  CARD_PADDING_Y: em(1.25),

  SEARCH_WIDTH: x-100,
  
  //Font
  FONT_SIZE: em(1),
  FONT_SIZE_SMALLER: em(0.75),
  FONT_SIZE_SMALL: em(0.875),
  FONT_SIZE_TITLE: em(1.25),
  
};
