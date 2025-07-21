/* Utilities */

/**
 * Add a rectangle of the given colour and coords (x, y, w, h) to the given surface.
 * @param s
 * @param colour
 * @param coords
 */
const d = (s, colour, coords) => {
    colour = `#${colour}`;
    s.add(new DrawableRectangle(Rectangle.fromOriginAndDimensions(...coords), colour));
}

/**
 * Return the offset for the ith block given the value of the block size
 * and the division line size.
 * @param i
 * @param vb
 * @param vd
 * @returns {number}
 */
const ob = (i, vb, vd) => {
    return i * (vd + vb);
}

/**
 * Return the offset for the ith division line given the value of the block size
 * and the division line size.
 * @param i
 * @param vb
 * @param vd
 * @returns {*}
 */
const od = (i, vb, vd) => {
    return (i * (vd + vb)) + vb
}

/**
 * Draw n blocks and division lines on the given surface.
 * The last division line is omitted.
 * @param s The surface
 * @param n The number of blocks
 * @param db The callback to draw the block
 * @param dd The callback to draw the division (optional)
 * @param adb Arguments to pass to the draw block callback (optional)
 * @param add Arguments to pass to the draw division callback (optional)
 */
const seq = (s, n, db, dd, adb, add) => {
    if (typeof (adb) === 'undefined') {
        adb = [];
    }

    if (typeof (add) === 'undefined') {
        add = [];
    }

    for (let i = 0; i < (n - 1); i++) {
        db(s, i, ...adb);
        if (typeof dd !== "undefined") {
            dd(s, i, ...add);
        }
    }

    db(s, n - 1, ...adb);
}

/* Keys */

/**
 * Draw the ith white key on the given surface
 * @param s
 * @param i
 */
const draw_white = (s, i) => {
    let y = ob(i, p.H_WHITE, p.H_WHITE_DIV)
    d(s, c.WHITE, [0, y, p.W_WHITE, p.H_WHITE]);
}

/**
 * Draw the ith white key division line on the given surface
 * @param s
 * @param i
 */
const draw_white_div = (s, i) => {
    let y = od(i, p.H_WHITE, p.H_WHITE_DIV);
    d(s, c.WHITE_DIV, [0, y, p.W_WHITE, p.H_WHITE_DIV]);
}

/**
 * Draw the ith black key on the given surface
 * Each black key has a unique offset from its default y value,
 * because black keys are not placed with 50/50 overlap on the two
 * white keys they touch. This is determined by its index.
 * @param s
 * @param i
 */
const draw_black = (s, i) => {
    if (p.YO_BLACK[i] === null) {
        return;
    }

    let yo = ((p.YO_BLACK[i] * p.H_BLACK) / 100);
    let y = ob(i + 1, p.H_WHITE, p.H_WHITE_DIV) - yo;
    d(s, c.BLACK, [0, y, p.W_BLACK, p.H_BLACK]);
}

/**
 * Draw piano keys on the given surface.
 * @param s
 */
const draw_keys = (s) => {
    seq(s, 7, draw_white, draw_white_div);
    seq(s, 7, draw_black);
}

/* Measures */

/**
 * Draw the ith black row on the given measure.
 * The height is the same as a black key.
 * The y offset works the same way as the corresponding black key
 * (in draw_black).
 * @param s
 * @param i
 */
const draw_row_black = (s, i) => {
    if (p.YO_BLACK[i] === null) {
        return;
    }

    let yo = ((p.YO_BLACK[i] * p.H_BLACK) / 100);
    let y = ob(i + 1, p.H_WHITE, p.H_WHITE_DIV) - yo;
    d(s, c.ROW_BLACK, [0, y, p.W_MEASURE, p.H_BLACK]);
    seq(s, p.N_BEATS_PER_MEASURE, draw_beat, draw_beat_div_black, [], [y]);
}

/**
 * Draw the ith beat on the given measure.
 * However, "beats" are just the voids between the beat division lines,
 * so this is a dummy function.
 * @param s
 * @param i
 */
const draw_beat = (s, i) => {}

/**
 * Draw the ith beat division line on the given surface.
 * This is on the white background.
 * @param s
 * @param i
 */
const draw_beat_div_white = (s, i) => {
    let x = od(i, p.W_BEAT, p.W_BEAT_DIV)
    d(s, c.BEAT_DIV_WHITE, [x, 0, p.W_BEAT_DIV, p.H_OCTAVE]);
}

/**
 * Draw the ith beat division line on the given surface.
 * This is on the black background.
 * @param s
 * @param i
 */
const draw_beat_div_black = (s, i, y) => {
    let x = od(i, p.W_BEAT, p.W_BEAT_DIV);
    d(s, c.BEAT_DIV_BLACK, [x, y, p.W_BEAT_DIV, p.H_BLACK]);
}

/**
 * Draw the ith measure on the given surface.
 * A measure is white rows, black rows, and beat division lines crossing them.
 * @param s
 * @param i
 */
const draw_measure = (s, i) => {
    let x = ob(i, p.W_MEASURE, p.W_MEASURE_DIV);
    let me = new Subcontext([x, 0]);

    d(me, c.ROW_WHITE, [0, 0, p.W_MEASURE, p.H_OCTAVE]);
    d(me, c.ROW_WHITE_DIV, [0, od(3, p.H_WHITE, p.H_WHITE_DIV), p.W_MEASURE, p.H_WHITE_DIV]);
    seq(me, p.N_BEATS_PER_MEASURE, draw_beat, draw_beat_div_white);
    seq(me, 7, draw_row_black);

    s.add(me);
}

/**
 * Draw the ith measure division line on the given surface.
 * @param s
 * @param i
 */
const draw_measure_div = (s, i) => {
    let x = od(i, p.W_MEASURE, p.W_MEASURE_DIV);
    d(s, c.MEASURE_DIV_BLACK, [x, 0, p.W_MEASURE_DIV, p.H_OCTAVE]);
}

/**
 * Draw measures on the given surface.
 * @param s
 */
const draw_measures = (s) => {
    seq(s, p.N_MEASURES, draw_measure, draw_measure_div);
}

/* Octaves */

/**
 * Draw the ith octave on the given surface.
 * An octave is the keys on the left and the measures on the right.
 * @param s
 * @param i
 */
const draw_octave = (s, i) => {
    let y = ob(i, p.H_OCTAVE, p.H_OCTAVE_DIV);
    let me = new Subcontext([p.W_L_BAR, y]);

    let sKeys = new Subcontext([0, 0]);

    let xMeasures = (p.W_WHITE + p.W_R_BAR_1 + p.W_R_BAR_2);
    let sMeasures = new Subcontext([xMeasures, 0]);

    draw_keys(sKeys);
    draw_measures(sMeasures);

    me.add(sKeys);
    me.add(sMeasures);
    s.add(me);
}

/**
 * Draw the ith octave division line on the given surface.
 * The octave division line crosses both the keys and the measures.
 * @param s
 * @param i
 */
const draw_octave_div = (s, i) => {
    let y = od(i, p.H_OCTAVE, p.H_OCTAVE_DIV);
    d(s, c.OCTAVE_DIV, [p.W_L_BAR, y, p.W_WHITE, p.H_OCTAVE_DIV]);
    d(s, c.ROW_OCTAVE_DIV, [(p.W_L_BAR + p.W_WHITE + p.W_R_BAR_1 + p.W_R_BAR_2), y, p.W, p.H_OCTAVE_DIV]);
}

/* Main */

/**
 * Update the parameters based on the inputs and the derived/calculated values
 * @returns {*}
 */
const deriveParameters = () => {
    // Copy parameters
    let s = JSON.parse(JSON.stringify(defaultBasics));
    let hs = JSON.parse(JSON.stringify(defaultHeights));
    let ws = JSON.parse(JSON.stringify(defaultWidths));

    // Update from inputs
    s.W_SCALE = parseFloat($('#inputWScale').val());
    s.H_SCALE = parseFloat($('#inputHScale').val());
    hs.H_WHITE = parseFloat($('#inputHWhite').val());
    hs.H_BLACK = parseFloat($('#inputHBlack').val());
    ws.W_BLACK_FACTOR = parseInt($('#inputWBlackFactor').val());
    ws.W_BLACK = ws.W_WHITE * (ws.W_BLACK_FACTOR / 100);

    let ab = parseInt($('#inputBlackAB').val());
    let de = parseInt($('#inputBlackDE').val());
    s.YO_BLACK = [ab, 50, 100 - ab, null, de, 100 - de, null];

    // Scale everything
    s.W_SCALE_FACTOR = $(document).width() / s.W_DOCUMENT_BASE;
    s.H_SCALE_FACTOR = $(document).height() / s.H_DOCUMENT_BASE;

    Object.keys(ws).forEach(function(k, i) {
        ws[k] *= s.W_SCALE * s.W_SCALE_FACTOR;
    });

    Object.keys(hs).forEach(function(k, i) {
        hs[k] *= s.H_SCALE * s.H_SCALE_FACTOR;
    });

    s = {...s, ...ws, ...hs};

    // Derive convenience parameters
    s.W_R_BARS = s.W_R_BAR_1 + s.W_R_BAR_2
    s.W_BARS = s.W_L_BAR + s.W_R_BARS
    s.W_KEY = s.W_WHITE
    s.W_STATIC = s.W_BARS + s.W_KEY
    s.W_MEASURE = ((s.N_BEATS_PER_MEASURE * (s.W_BEAT + s.W_BEAT_DIV)) - s.W_BEAT_DIV);
    s.H_OCTAVE = ((7 * (s.H_WHITE + s.H_WHITE_DIV)) - s.H_WHITE_DIV);
    // s.W = (s.W_L_BAR + s.W_WHITE + s.W_R_BAR_1 + s.W_R_BAR_2 + ((s.N_MEASURES * (s.W_MEASURE + s.W_MEASURE_DIV)) - s.W_MEASURE_DIV));
    // s.H = (s.N_OCTAVES * (s.H_OCTAVE + s.H_OCTAVE_DIV)) - s.H_OCTAVE_DIV;

    // N of octaves and measures to give impression of infinity
    s.W = w;
    s.H = h;
    s.N_OCTAVES = (s.H / s.H_OCTAVE) + 1
    s.N_MEASURES = ((s.W - s.W_STATIC) / s.W_MEASURE) + 1

    return s;
}


/**
 * Reset the canvas and its variables.
 */
const reset = () => {
    let wrap = $('#canvasKeysWrap');
    let el = `<canvas id="canvasKeys" width="${w}px" height="${h}px"></canvas>`;

    wrap.empty();
    wrap.append(el);

    canvas = $('#canvasKeys').get(0);
    ctx = canvas.getContext('2d');
    p = deriveParameters();
}

/**
 * Draw the canvas.
 */
const draw = () => {
    reset();

    sub = new Subcontext([0, 0]);
    // d(sub, BG, [0, 0, W, H]); // Background colour

    seq(sub, p.N_OCTAVES, draw_octave, draw_octave_div);

    d(sub, c.L_BAR, [0, 0, p.W_L_BAR, p.H]);
    d(sub, c.R_BAR_1, [p.W_L_BAR + p.W_WHITE, 0, p.W_R_BAR_1, p.H]);
    d(sub, c.R_BAR_2_WHITE, [p.W_L_BAR + p.W_WHITE + p.W_R_BAR_1, 0, p.W_R_BAR_2, p.H]);

    sub.draw(ctx);
}

/**
 * Bind the controls.
 */
const bind = () => {
    $('.controlInput').change(draw);
}

/**
 * Initialize the app.
 */
const initialize = () => {
    let wrap = $('#canvasKeysWrap');
    w = wrap.width();
    h = wrap.height();
    draw();
    bind();
}

/**
 * Globals
 */
let canvas;
let ctx;
let sub;
let p; // Parameters
const c = colours; // Convenience
let w; // Canvas space width
let h; // Canvas space height

/**
 * Go!
 */
$(document).ready(initialize);
