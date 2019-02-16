const metricSemaphores = {
  type: 'items',
  label: 'Metric Semaphores',
  items: {
    AllMetrics: {
      ref: 'allmetrics',
      type: 'boolean',
      component: 'switch',
      label: 'All metrics affected',
      options: [
        {
          value: true,
          label: 'On'
        },
        {
          value: false,
          label: 'Off'
        }
      ],
      defaultValue: false
    },
    MetricsAffected: {
      ref: 'metricssemaphore',
      translation: 'Metrics affected (1,2,4,...)',
      type: 'string',
      defaultValue: '0',
      show (data) {
        return data.allmetrics == false;
      }
    },
    MetricStatus1: {
      ref: 'metricsstatus1',
      translation: 'Critic is less than',
      type: 'number',
      defaultValue: -0.1
    },
    ColorStatus1: {
      ref: 'colorstatus1',
      label: 'Critic Color Fill',
      type: 'object',
      component: 'color-picker',
      defaultValue: {
        index: 7,
        color: '#f93f17'
      }
    },
    ColorStatus1Text: {
      ref: 'colorstatus1text',
      label: 'Critic Color Text',
      type: 'object',
      component: 'color-picker',
      defaultValue: {
        index: 10,
        color: '#ffffff'
      }
    },
    MetricStatus2: {
      ref: 'metricsstatus2',
      translation: 'Medium is less than',
      type: 'number',
      defaultValue: 0
    },
    ColorStatus2: {
      ref: 'colorstatus2',
      label: 'Medium Color Fill',
      type: 'object',
      component: 'color-picker',
      defaultValue: {
        index: 8,
        color: '#ffcf02'
      }
    },
    ColorStatus2Text: {
      ref: 'colorstatus2text',
      label: 'Medium Color Text',
      type: 'object',
      component: 'color-picker',
      defaultValue: {
        index: 11,
        color: '#000000'
      }
    },
    ColorStatus3: {
      ref: 'colorstatus3',
      label: 'Success Color Fill',
      type: 'object',
      component: 'color-picker',
      defaultValue: {
        index: 9,
        color: '#276e27'
      }
    },
    ColorStatus3Text: {
      ref: 'colorstatus3text',
      label: 'Success Color Text',
      type: 'object',
      component: 'color-picker',
      defaultValue: {
        index: 10,
        color: '#ffffff'
      }
    }
  }
};

export default metricSemaphores;