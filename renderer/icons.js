const Icons = {
  Sun: () => React.createElement('svg', {
    className: 'icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2'
  },
    React.createElement('circle', { cx: '12', cy: '12', r: '5' }),
    React.createElement('line', { x1: '12', y1: '1', x2: '12', y2: '3' }),
    React.createElement('line', { x1: '12', y1: '21', x2: '12', y2: '23' }),
    React.createElement('line', { x1: '4.22', y1: '4.22', x2: '5.64', y2: '5.64' }),
    React.createElement('line', { x1: '18.36', y1: '18.36', x2: '19.78', y2: '19.78' }),
    React.createElement('line', { x1: '1', y1: '12', x2: '3', y2: '12' }),
    React.createElement('line', { x1: '21', y1: '12', x2: '23', y2: '12' }),
    React.createElement('line', { x1: '4.22', y1: '19.78', x2: '5.64', y2: '18.36' }),
    React.createElement('line', { x1: '18.36', y1: '5.64', x2: '19.78', y2: '4.22' })
  ),

  Moon: () => React.createElement('svg', {
    className: 'icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2'
  },
    React.createElement('path', { d: 'M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z' })
  ),

  Globe: () => React.createElement('svg', {
    className: 'icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2'
  },
    React.createElement('circle', { cx: '12', cy: '12', r: '10' }),
    React.createElement('line', { x1: '2', y1: '12', x2: '22', y2: '12' }),
    React.createElement('path', { d: 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z' })
  ),

  Mic: () => React.createElement('svg', {
    className: 'icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2'
  },
    React.createElement('path', { d: 'M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z' }),
    React.createElement('path', { d: 'M19 10v2a7 7 0 0 1-14 0v-2' }),
    React.createElement('line', { x1: '12', y1: '19', x2: '12', y2: '23' }),
    React.createElement('line', { x1: '8', y1: '23', x2: '16', y2: '23' })
  ),

  Upload: () => React.createElement('svg', {
    className: 'icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2'
  },
    React.createElement('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
    React.createElement('polyline', { points: '17 8 12 3 7 8' }),
    React.createElement('line', { x1: '12', y1: '3', x2: '12', y2: '15' })
  ),

  Play: () => React.createElement('svg', {
    className: 'icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2'
  },
    React.createElement('polygon', { points: '5 3 19 12 5 21 5 3' })
  ),

  Stop: () => React.createElement('svg', {
    className: 'icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2'
  },
    React.createElement('rect', { x: '6', y: '6', width: '12', height: '12', rx: '2' })
  ),

  File: () => React.createElement('svg', {
    className: 'icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2'
  },
    React.createElement('path', { d: 'M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z' }),
    React.createElement('polyline', { points: '13 2 13 9 20 9' })
  ),

  Loader: () => React.createElement('svg', {
    className: 'icon spinning',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2'
  },
    React.createElement('line', { x1: '12', y1: '2', x2: '12', y2: '6' }),
    React.createElement('line', { x1: '12', y1: '18', x2: '12', y2: '22' }),
    React.createElement('line', { x1: '4.93', y1: '4.93', x2: '7.76', y2: '7.76' }),
    React.createElement('line', { x1: '16.24', y1: '16.24', x2: '19.07', y2: '19.07' }),
    React.createElement('line', { x1: '2', y1: '12', x2: '6', y2: '12' }),
    React.createElement('line', { x1: '18', y1: '12', x2: '22', y2: '12' }),
    React.createElement('line', { x1: '4.93', y1: '19.07', x2: '7.76', y2: '16.24' }),
    React.createElement('line', { x1: '16.24', y1: '7.76', x2: '19.07', y2: '4.93' })
  ),

  FileText: () => React.createElement('svg', {
    className: 'icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2'
  },
    React.createElement('path', { d: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z' }),
    React.createElement('polyline', { points: '14 2 14 8 20 8' }),
    React.createElement('line', { x1: '16', y1: '13', x2: '8', y2: '13' }),
    React.createElement('line', { x1: '16', y1: '17', x2: '8', y2: '17' }),
    React.createElement('polyline', { points: '10 9 9 9 8 9' })
  ),

  Download: () => React.createElement('svg', {
    className: 'icon',
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: '2'
  },
    React.createElement('path', { d: 'M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4' }),
    React.createElement('polyline', { points: '7 10 12 15 17 10' }),
    React.createElement('line', { x1: '12', y1: '15', x2: '12', y2: '3' })
  )
};
