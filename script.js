// Handy...

const d = (s, colour, coords) => {
    colour = `#${colour}`;
    s.add(new DrawableRectangle(Rectangle.fromOriginAndDimensions(...coords), colour));
}

const ob = (i, vb, vd) => {
    return i * (vd + vb);
}

const od = (i, vb, vd) => {
    return (i * (vd + vb)) + vb
}

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

// Components

/* Keys */

const draw_white = (s, i) => {
    let y = ob(i, H_WHITE, H_WHITE_DIV)
    d(s, C_WHITE, [0, y, W_WHITE, H_WHITE]);
}

const draw_white_div = (s, i) => {
    let y = od(i, H_WHITE, H_WHITE_DIV);
    d(s, C_WHITE_DIV, [0, y, W_WHITE, H_WHITE_DIV]);
}

const draw_black = (s, i) => {
    if (YO_BLACK[i] === null) {
        return;
    }

    let yo = ((YO_BLACK[i] * H_BLACK) / 100);
    let y = ob(i + 1, H_WHITE, H_WHITE_DIV) - yo;
    d(s, C_BLACK, [0, y, W_BLACK, H_BLACK]);
}

const draw_keys = (s) => {
    seq(s, 7, draw_white, draw_white_div);
    seq(s, 7, draw_black);
}

/* Measures */

const draw_row_black = (s, i) => {
    if (YO_BLACK[i] === null) {
        return;
    }

    let yo = ((YO_BLACK[i] * H_BLACK) / 100);
    let y = ob(i + 1, H_WHITE, H_WHITE_DIV) - yo;
    d(s, C_ROW_BLACK, [0, y, W_MEASURE, H_BLACK]);
    seq(s, N_BEATS_PER_MEASURE, draw_beat, draw_beat_div_black, [], [y]);
}

const draw_beat = (s, i) => {}

const draw_beat_div_white = (s, i) => {
    let x = od(i, W_BEAT, W_BEAT_DIV)
    d(s, C_BEAT_DIV_WHITE, [x, 0, W_BEAT_DIV, H_OCTAVE]);
}

const draw_beat_div_black = (s, i, y) => {
    let x = od(i, W_BEAT, W_BEAT_DIV);
    d(s, C_BEAT_DIV_BLACK, [x, y, W_BEAT_DIV, H_BLACK]);
}

const draw_measure = (s, i) => {
    let x = ob(i, W_MEASURE, W_MEASURE_DIV);
    let me = new Subcontext([x, 0]);

    d(me, C_ROW_WHITE, [0, 0, W_MEASURE, H_OCTAVE]);
    d(me, C_ROW_WHITE_DIV, [0, od(3, H_WHITE, H_WHITE_DIV), W_MEASURE, H_WHITE_DIV]);
    seq(me, N_BEATS_PER_MEASURE, draw_beat, draw_beat_div_white);
    seq(me, 7, draw_row_black);

    s.add(me);
}

const draw_measure_div = (s, i) => {
    let x = od(i, W_MEASURE, W_MEASURE_DIV);
    d(s, C_MEASURE_DIV_BLACK, [x, 0, W_MEASURE_DIV, H_OCTAVE]);
}

const draw_measures = (s) => {
    seq(s, N_MEASURES, draw_measure, draw_measure_div);
}

/* Octaves */

const draw_octave = (s, i) => {
    let y = ob(i, H_OCTAVE, H_OCTAVE_DIV);
    let me = new Subcontext([W_L_BAR, y]);

    let sKeys = new Subcontext([0, 0]);

    let xMeasures = (W_WHITE + W_R_BAR_1 + W_R_BAR_2);
    let sMeasures = new Subcontext([xMeasures, 0]);

    draw_keys(sKeys);
    draw_measures(sMeasures);

    me.add(sKeys);
    me.add(sMeasures);
    s.add(me);
}

const draw_octave_div = (s, i) => {
    let y = od(i, H_OCTAVE, H_OCTAVE_DIV);
    d(s, C_OCTAVE_DIV, [W_L_BAR, y, W_WHITE, H_OCTAVE_DIV]);
    d(s, C_ROW_OCTAVE_DIV, [(W_L_BAR + W_WHITE + W_R_BAR_1 + W_R_BAR_2), y, W, H_OCTAVE_DIV]);
}

/* Main */

const reset = () => {
    let wrap = $('#canvasKeysWrap');
    let w = wrap.width();
    let h = wrap.height();
    let el = `<canvas id="canvasKeys" width="${w}px" height="${h}px"></canvas>`;

    wrap.empty();
    wrap.append(el);

    canvas = $('#canvasKeys').get(0);
    ctx = canvas.getContext('2d');
}

const draw = () => {
    reset();

    sub = new Subcontext([0, 0]);
    // d(sub, C_BG, [0, 0, W, H]);

    seq(sub, N_OCTAVES, draw_octave, draw_octave_div);

    d(sub, C_L_BAR, [0, 0, W_L_BAR, H]);
    d(sub, C_R_BAR_1, [W_L_BAR + W_WHITE, 0, W_R_BAR_1, H]);
    d(sub, C_R_BAR_2_WHITE, [W_L_BAR + W_WHITE + W_R_BAR_1, 0, W_R_BAR_2, H]);

    sub.draw(ctx);
}

const bind = () => {

}

const initialize = () => {
    draw();
    bind();
}

let canvas;
let ctx;
let sub;
$(document).ready(initialize);
