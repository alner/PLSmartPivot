import $ from 'jquery';
import initializeStore from './store';
import React from 'react';
import ReactDOM from 'react-dom';
import HeadersTable from './headers-table/index.jsx';
import DataTable from './data-table/index.jsx';

export default async function paint ($element, layout, component) {
  const state = await initializeStore({
    $element,
    component,
    layout
  });

  const jsx = (
    <React.Fragment>
      <div className="kpi-table">
        <HeadersTable
          data={state.data}
          general={state.general}
          qlik={component}
          styling={state.styling}
        />
        <DataTable
          data={state.data}
          general={state.general}
          qlik={component}
          renderData={false}
          styling={state.styling}
        />
      </div>
      <div className="data-table">
        <HeadersTable
          data={state.data}
          general={state.general}
          qlik={component}
          styling={state.styling}
        />
        <DataTable
          data={state.data}
          general={state.general}
          qlik={component}
          styling={state.styling}
        />
      </div>
    </React.Fragment>
  );

  ReactDOM.render(jsx, $element[0]);


  // TODO: skipped the following as they weren't blockers for letting react handle rendering,
  // they are however the only reason we still depend on jQuery and should be removed as part of unnecessary dependencies issue
  $(`[tid="${layout.qInfo.qId}"] .data-table .row-wrapper`).on('scroll', function () {
    $(`[tid="${layout.qInfo.qId}"] .kpi-table .row-wrapper`).scrollTop($(this).scrollTop());
  });

  // freeze first column
  $(`[tid="${layout.qInfo.qId}"] .qv-object-content-container`).on('scroll', (t) => {
    $(`[tid="${layout.qInfo.qId}"] .kpi-table`).css('left', `${Math.round(t.target.scrollLeft)}px`);
  });

  // TODO: fixing tooltips has a seperate issue, make sure to remove this as part of that issue
  $(`[tid="${layout.qInfo.qId}"] .header-wrapper th`).hover(function () {
    $(`[tid="${layout.qInfo.qId}"] .tooltip`).delay(500)
      .show(0);
    $(`[tid="${layout.qInfo.qId}"] .header-wrapper th`).children(`[tid="${layout.qInfo.qId}"] .tooltip`)
      .remove();

    const element = $(this);
    const offset = element.offset();
    const toolTip = $('<div class="tooltip"></div>');

    toolTip.css({
      left: offset.left,
      top: offset.top
    });

    toolTip.text(element.text());
    $(`[tid="${layout.qInfo.qId}"] .header-wrapper th`).append(toolTip);
  }, () => {
    $(`[tid="${layout.qInfo.qId}"] .tooltip`).delay(0)
      .hide(0);
  });

  // TODO: excel export is broken in most browsers, fixing it has an issue of it's own (leaving it disabled for now)
  // import { enableExcelExport } from './excel-export';
  // enableExcelExport(layout, html);
}