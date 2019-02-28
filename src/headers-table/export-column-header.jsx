import React from 'react';
import PropTypes from 'prop-types';
import ExportButton from '../export-button.jsx';
import { HEADER_FONT_SIZE } from '../initialize-transformed';

const ExportColumnHeader = ({ baseCSS, general, title, allowExcelExport, hasSecondDimension, styling }) => {
  const rowSpan = hasSecondDimension ? 2 : 1;
  const isMediumFontSize = styling.headerOptions.fontSizeAdjustment === HEADER_FONT_SIZE.MEDIUM;
  const style = {
    ...baseCSS,
    cursor: 'default',
    fontSize: `${16 + styling.headerOptions.fontSizeAdjustment}px`,
    height: isMediumFontSize ? '100px' : '80px',
    verticalAlign: 'middle',
    width: '230px'
  };

  return (
    <th
      className="fdim-cells"
      rowSpan={rowSpan}
      style={style}
    >
      <ExportButton
        excelExport={allowExcelExport}
        general={general}
      />
      {title}
    </th>
  );
};

ExportColumnHeader.propTypes = {
  allowExcelExport: PropTypes.bool.isRequired,
  baseCSS: PropTypes.shape({}).isRequired,
  general: PropTypes.shape({}).isRequired,
  hasSecondDimension: PropTypes.bool.isRequired,
  styling: PropTypes.shape({
    headerOptions: PropTypes.shape({
      fontSizeAdjustment: PropTypes.number.isRequired
    }).isRequired
  }).isRequired,
  title: PropTypes.string.isRequired
};

export default ExportColumnHeader;
