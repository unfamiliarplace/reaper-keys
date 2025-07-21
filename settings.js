const defaultBasics = {
    N_BEATS_PER_MEASURE: 16,
    N_MEASURES: 3,
    N_OCTAVES: 3,

    W_SCALE_FACTOR: 2,
    H_SCALE_FACTOR: 2.65,
    W_SCALE: 1,
    H_SCALE: 1,

    YO_BLACK: [70, 50, 30, null, 60, 40, null]
}

const defaultWidths = {
    W_L_BAR: 1,
    W_R_BAR_1: 3,
    W_R_BAR_2: 1,
    W_WHITE: 191,
    W_BLACK: 109,
    W_BEAT: 10,
    W_BEAT_DIV: 1,
    W_MEASURE_DIV: 1
}

const defaultHeights = {
    H_WHITE: 25,
    H_WHITE_DIV: 1,
    H_BLACK: 15,
    H_OCTAVE_DIV: 1
}

const colours = {
    BG: '000000',
    WHITE: 'ffffff',
    BLACK: '000000',
    L_BAR: 'abb1b1',
    R_BAR_1: 'abb1b1',
    R_BAR_2_WHITE: '5c5c5c',
    R_BAR_2_BLACK: '555555',
    WHITE_DIV: '5d5d5d',
    ROW_WHITE: '464646',
    ROW_BLACK: '3e3e3e',
    ROW_WHITE_DIV: '3e3e3e',
    ROW_OCTAVE_DIV: '383838',
    OCTAVE_DIV: '111111',
    WHITE_DIV_BEAT_DIV: '363636',
    BEAT_DIV_BLACK: '363636',
    BEAT_DIV_WHITE: '3d3d3d',
    MEASURE_DIV_WHITE: '383838',
    MEASURE_DIV_BLACK: '313131',
}

const deriveParameters = () => {
    // Copy parameters and update from inputs
    let s = JSON.parse(JSON.stringify(defaultBasics));
    s.W_SCALE = parseFloat($('#inputWScale').val());
    s.H_SCALE = parseFloat($('#inputHScale').val());

    let hs = JSON.parse(JSON.stringify(defaultHeights));
    hs.H_WHITE = parseFloat($('#inputHWhite').val());
    hs.H_BLACK = parseFloat($('#inputHBlack').val());

    let ws = JSON.parse(JSON.stringify(defaultWidths));

    // Scale everything
    Object.keys(ws).forEach(function(k, i) {
        ws[k] *= s.W_SCALE * s.W_SCALE_FACTOR;
    });

    Object.keys(hs).forEach(function(k, i) {
        hs[k] *= s.H_SCALE * s.H_SCALE_FACTOR;
    });

    s = {...s, ...ws, ...hs};

    // Derive convenience parameters
    s.W_MEASURE = ((s.N_BEATS_PER_MEASURE * (s.W_BEAT + s.W_BEAT_DIV)) - s.W_BEAT_DIV);
    s.H_OCTAVE = ((7 * (s.H_WHITE + s.H_WHITE_DIV)) - s.H_WHITE_DIV);
    s.W = (s.W_L_BAR + s.W_WHITE + s.W_R_BAR_1 + s.W_R_BAR_2 + ((s.N_MEASURES * (s.W_MEASURE + s.W_MEASURE_DIV)) - s.W_MEASURE_DIV));
    s.H = (s.N_OCTAVES * (s.H_OCTAVE + s.H_OCTAVE_DIV)) - s.H_OCTAVE_DIV;

    return s;
}
