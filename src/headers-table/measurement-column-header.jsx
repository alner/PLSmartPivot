import React from 'react';
import PropTypes from 'prop-types';
import { HEADER_FONT_SIZE } from '../initialize-transformed';
import Tooltip from '../tooltip/index.jsx';

const MeasurementColumnHeader = ({ baseCSS, general, hasSecondDimension, measurement, styling }) => {
  const title = `${measurement.name} ${measurement.magnitudeLabelSuffix}`;
  const { fontSizeAdjustment } = styling.headerOptions;
  const isMediumFontSize = fontSizeAdjustment === HEADER_FONT_SIZE.MEDIUM;

  if (hasSecondDimension) {
    const isPercentageFormat = measurement.format.substring(measurement.format.length - 1) === '%';
    let baseFontSize = 14;
    let cellClass = 'grid-cells2';
    if (isPercentageFormat) {
      baseFontSize = 13;
      cellClass = 'grid-cells2-small';
    }
    const cellStyle = {
      ...baseCSS,
      cursor: 'default',
      fontSize: `${baseFontSize + fontSizeAdjustment}px`,
      height: isMediumFontSize ? '40px' : '25px',
      verticalAlign: 'middle'
    };
    return (
      <th
        className={`${cellClass}${general.cellSuffix}`}
        style={cellStyle}
      >
        <span className="wrapclass25">
          <Tooltip
            tooltipText={title}
          >
            {title}
          </Tooltip>
        </span>
      </th>
    );
  }

  const isLong = (title.length > 11 && fontSizeAdjustment === HEADER_FONT_SIZE.SMALL)
    || (title.length > 12 && fontSizeAdjustment === HEADER_FONT_SIZE.MEDIUM);
  const suffixWrap = isLong ? '70' : 'empty';
  const style = {
    ...baseCSS,
    cursor: 'default',
    fontSize: `${15 + fontSizeAdjustment}px`,
    height: isMediumFontSize ? '100px' : '80px',
    verticalAlign: 'middle'
  };
  return (
    <th
      className={`grid-cells2${general.cellSuffix}`}
      style={style}
    >
      <span
        className={`wrapclass${suffixWrap}`}
        style={{ fontFamily: styling.headerOptions.fontFamily }}
      >
        {title}
      </span>
    </th>
  );
};

MeasurementColumnHeader.defaultProps = {
  hasSecondDimension: false
};

MeasurementColumnHeader.propTypes = {
  baseCSS: PropTypes.shape({}).isRequired,
  general: PropTypes.shape({
    cellSuffix: PropTypes.string.isRequired
  }).isRequired,
  hasSecondDimension: PropTypes.bool,
  measurement: PropTypes.shape({
    name: PropTypes.string.isRequired
  }).isRequired,
  styling: PropTypes.shape({
    headerOptions: PropTypes.shape({
      fontSizeAdjustment: PropTypes.number.isRequired
    }).isRequired
  }).isRequired
};

export default MeasurementColumnHeader;
