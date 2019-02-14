import React from 'react';
import PropTypes from 'prop-types';
import { ApplyPreMask } from '../masking';
import { addSeparators } from '../utilities';
import Tooltip from '../tooltip/index.jsx';
function formatMeasurementValue (measurement, styling) {
  // TODO: measurement.name is a horrible propertyname, it's actually the column header
  const isColumnPercentageBased = measurement.parents.measurement.header.substring(0, 1) === '%';
  let formattedMeasurementValue = '';
  if (isColumnPercentageBased) {
    if (isNaN(measurement.value)) {
      formattedMeasurementValue = styling.symbolForNulls;
    } else {
      formattedMeasurementValue = ApplyPreMask('0,00%', measurement.value);
    }
  } else {
    let magnitudeDivider;
    switch (measurement.magnitude.toLowerCase()) {
      case 'k':
        magnitudeDivider = 1000;
        break;
      case 'm':
        magnitudeDivider = 1000000;
        break;
      default:
        magnitudeDivider = 1;
    }
    const formattingStringWithoutMagnitude = measurement.format.replace(/k|K|m|M/gi, '');
    if (isNaN(measurement.value)) {
      formattedMeasurementValue = styling.symbolForNulls;
    } else {
      let preFormatValue = measurement.value;
      if (isColumnPercentageBased) {
        preFormatValue *= 100;
      }
      switch (formattingStringWithoutMagnitude) {
        case '#.##0':
          formattedMeasurementValue = addSeparators((preFormatValue / magnitudeDivider), '.', ',', 0);
          break;
        case '#,##0':
          formattedMeasurementValue = addSeparators((preFormatValue / magnitudeDivider), ',', '.', 0);
          break;
        default:
          formattedMeasurementValue = ApplyPreMask(
            formattingStringWithoutMagnitude,
            (preFormatValue / magnitudeDivider)
          );
          break;
      }
    }
  }
  return formattedMeasurementValue;
}

function getSemaphoreColors (measurement, semaphoreColors) {
  if (measurement < semaphoreColors.status.critical) {
    return semaphoreColors.statusColors.critical;
  }
  if (measurement < semaphoreColors.status.medium) {
    return semaphoreColors.statusColors.medium;
  }
  return semaphoreColors.statusColors.normal;
}
class DataCell extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      bool: false,
      mouseXPosition: 0,
      mouseYPosition: 0
    };
    this.handleEnter = this.handleEnter.bind(this);
    this.handleLeave = this.handleLeave.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
  }

  shouldComponentUpdate (nextProps, nextState) {
    const { bool } = this.state;
    if (bool === nextState.bool) {
      return false;
    }
    return true;
  }

  handleSelect () {
    const { data: { meta: { dimensionCount } }, general: { allowFilteringByClick }, measurement, qlik } = this.props;
    const hasSecondDimension = dimensionCount > 1;
    if (!allowFilteringByClick) {
      return;
    }

    qlik.backendApi.selectValues(0, [measurement.parents.dimension1.elementNumber], true);

    if (hasSecondDimension) {
      qlik.backendApi.selectValues(1, [measurement.parents.dimension2.elementNumber], true);
    }
  }

  handleEnter (event) {
    this.setState({ bool: true,
      mouseXPosition: event.clientX,
      mouseYPosition: event.clientY });
  }

  handleLeave () {
    this.setState({ bool: false });
  }

  render () {
    const { bool, mouseXPosition, mouseYPosition } = this.state;
    const {
      data,
      general,
      measurement,
      styleBuilder,
      styling,
      qlik
    } = this.props;

    const inEditState = qlik.inEditState();
    const isColumnPercentageBased = measurement.name.substring(0, 1) === '%';
    let formattedMeasurementValue = formatMeasurementValue(measurement, styling);
    if (styleBuilder.hasComments()) {
      formattedMeasurementValue = '.';
    }
    let textAlignment = 'Right';
    const textAlignmentProp = styling.options.textAlignment;
    if (textAlignmentProp) {
      textAlignment = textAlignmentProp;
    }

    let cellStyle = {
      fontFamily: styling.options.fontFamily,
      ...styleBuilder.getStyle(),
      paddingLeft: '4px',
      textAlign: textAlignment

    };
    const { semaphoreColors } = styling;
    const isValidSemaphoreValue = !styleBuilder.hasComments() && !isNaN(measurement.value);
    const shouldHaveSemaphoreColors = semaphoreColors.fieldsToApplyTo.applyToAll || semaphoreColors.fieldsToApplyTo.specificFields.indexOf(measurement.parents.dimension1.header) !== -1;
    if (isValidSemaphoreValue && shouldHaveSemaphoreColors) {
      const { backgroundColor, color } = getSemaphoreColors(measurement, semaphoreColors);
      cellStyle = {
        backgroundColor,
        color,
        fontFamily: styling.options.fontFamily,
        fontSize: styleBuilder.getStyle().fontSize,
        paddingLeft: '4px',
        textAlign: textAlignment
      };
    }

    let cellClass = 'grid-cells';
    const shouldUseSmallCells = isColumnPercentageBased && data.headers.measurements.length > 1;
    if (shouldUseSmallCells) {
      cellClass = 'grid-cells-small';
    }

    return (
      <td
        className={`${cellClass}${general.cellSuffix}`}
        onClick={this.handleSelect}
        onMouseOut={this.handleLeave}
        onMouseOver={this.handleEnter}
        style={cellStyle}
      >
        {formattedMeasurementValue}
        {bool && !inEditState
          ?
          <Tooltip
            data={formattedMeasurementValue}
            xPosition={mouseXPosition}
            yPosition={mouseYPosition}
          /> : null}
      </td>
    );
  }
}

DataCell.propTypes = {
  data: PropTypes.shape({
    headers: PropTypes.shape({
      measurements: PropTypes.array.isRequired
    }).isRequired
  }).isRequired,
  general: PropTypes.shape({
    cellSuffix: PropTypes.string.isRequired
  }).isRequired,
  measurement: PropTypes.shape({
    format: PropTypes.string,
    name: PropTypes.string,
    value: PropTypes.any
  }).isRequired,
  qlik: PropTypes.shape({
    backendApi: PropTypes.shape({
      selectValues: PropTypes.func.isRequired
    }).isRequired
  }).isRequired,
  styleBuilder: PropTypes.shape({
    hasComments: PropTypes.func.isRequired
  }).isRequired,
  styling: PropTypes.shape({
    symbolForNulls: PropTypes.any.isRequired
  }).isRequired
};

export default DataCell;
