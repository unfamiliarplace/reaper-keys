class Point {
    x
    y

    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

class Rectangle {
    lx
    ty
    rx
    by

    x
    y
    w
    h

    tl
    tr
    bl
    br

    static fromCorners(lx, ty, rx, by) {
        return new Rectangle(lx, ty, rx, by);
    }

    static fromOriginAndDimensions(x, y, w, h) {
        return new Rectangle(x, y, x + w, y + h);
    }

    constructor(lx, ty, rx, by) {
        // system 1
        this.lx = lx;
        this.ty = ty;
        this.rx = rx;
        this.by = by;

        // system 2
        this.x = lx;
        this.y = ty;
        this.w = rx - lx;
        this.h = by - ty;

        // system 3
        this._calculateCorners();
    }

    updateOrigin(lx, ty) {
        this.lx = lx;
        this.ty = ty;
        this.rx = lx + this.w;
        this.by = ty + this.h;

        this.x = lx;
        this.y = ty;

        this._calculateCorners();
    }

    origin() {
        return this.tl;
    }

    _calculateCorners() {
        this.tl = new Point(this.lx, this.ty);
        this.tr = new Point(this.rx, this.ty);
        this.bl = new Point(this.lx, this.by);
        this.br = new Point(this.rx, this.by);
    }

    corners() {
        return [this.tl, this.tr, this.bl, this.br];
    }

    centre() {
        return new Point(this.x + (this.w / 2), this.y + (this.h / 2));
    }

    pointCollides(p, xOffset, yOffset) {
        if (typeof xOffset === 'undefined') {
            xOffset = 0;
        }

        if (typeof yOffset === 'undefined') {
            yOffset = 0;
        }

        return [
            this.lx <= (p.x + xOffset),
            this.rx >= (p.x + xOffset),
            this.ty <= (p.y + yOffset),
            this.by >= (p.y + yOffset)
        ].every(Boolean);
    }

    rectCollides(r2) {
        for (let corner of r2.corners()) {
            if (this.pointCollides(corner)) {
                return true;
            }
        }

        return false;
    }
}

// class DrawnObject {
//     ctx
//     constructor(ctx) {
//         this.ctx = ctx;
//     }
//
//     drawWrap = () => {
//         this.ctx.save();
//         this.draw();
//         this.ctx.restore();
//     }
//
//     draw = () => {
//
//     }
// }

class DrawableRectangle {
    rect
    fillStyle
    strokeStyle
    lineWidth

    constructor(rect, fillStyle, strokeStyle, lineWidth) {
        this.rect = rect;

        if (typeof (fillStyle) === 'undefined') {
            fillStyle = strokeStyle;
        }

        if (typeof (strokeStyle) === 'undefined') {
            strokeStyle = fillStyle;
        }

        if (typeof (lineWidth) === 'undefined') {
            lineWidth = 0;
        }

        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
    }

    draw = (ctx, xOffset, yOffset) => {
        if (typeof xOffset === 'undefined') {
            xOffset = 0;
        }

        if (typeof yOffset === 'undefined') {
            yOffset = 0;
        }

        // ctx.save();
        ctx.fillStyle = this.fillStyle;
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.fillRect(this.rect.x + xOffset, this.rect.y + yOffset, this.rect.w, this.rect.h);
        ctx.restore();
    }
}

class Subcontext {
    x
    y
    subs

    constructor(coords) {
        [this.x, this.y] = coords;
        this.subs = [];
    }

    add = (sub) => {
        this.subs.push(sub);
    }

    draw = (ctx, xOffset, yOffset) => {
        if (typeof xOffset === 'undefined') {
            xOffset = 0;
        }

        if (typeof yOffset === 'undefined') {
            yOffset = 0;
        }

        for (const sub of this.subs) {
            sub.draw(ctx, this.x + xOffset, this.y + yOffset);
        }
    }
}
