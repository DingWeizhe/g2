const Util = require("../../util");
const G = require("@ay/g-node");
const Base = require("./base");
const PathUtil = G.PathUtil;
const Path = G.Path;

class RegionFilter extends Base {
  getDefaultCfg() {
    const cfg = super.getDefaultCfg();

    return Util.mix({}, cfg, {
      name: "regionFilter",
      zIndex: 1,
      top: true,
      start: null,
      end: null,
      color: null,
      apply: null,
      style: {
        opacity: 1
      }
    });
  }

  render(coord, group, view) {
    const self = this;
    const layer = group.addGroup();
    layer.name = "guide-region-filter";
    view.once("afterpaint", function() {
      // 2018-08-08 by blue.lb padding为auto时，会导致重新绘制一次，这时候layer已经被销毁了
      if (layer.get("destroyed")) return;
      self._drawShapes(view, layer);
      const clip = self._drawClip(coord);
      layer.attr({ clip });
      self.clip = clip;
      self.appendInfo && layer.setSilent("appendInfo", self.appendInfo);
      self.el = layer;
    });
  }

  _drawShapes(view, layer) {
    const self = this;
    const output = [];
    const geoms = view.getAllGeoms();
    geoms.map(geom => {
      const shapes = geom.getShapes();
      const geomType = geom.type;
      const filter = self._geomFilter(geomType);
      if (filter) {
        shapes.map(shape => {
          const shapeType = shape.type;
          const shapeAttr = Util.mix({}, shape.attr());
          self._adjustDisplay(shapeAttr);
          const s = layer.addShape(shapeType, {
            attrs: shapeAttr
          });
          output.push(s);
          return shape;
        });
      }
      return geom;
    });
    return output;
  }

  _drawClip(coord) {
    const self = this;
    let start = self.parsePoint(coord, self.start, false);
    let end = self.parsePoint(coord, self.end, false);

    let path;

    path = [
      ["M", start.x, start.y],
      ["L", end.x, start.y],
      ["L", end.x, end.y],
      ["L", start.x, end.y],
      ["z"]
    ];

    const clip = new Path({
      attrs: {
        path,
        opacity: 1
      }
    });

    return clip;
  }

  _adjustDisplay(attr) {
    const self = this;
    const color = self.color;
    if (attr.fill) {
      attr.fill = attr.fillStyle = color;
    }
    attr.stroke = attr.strokeStyle = color;
  }

  _geomFilter(geomType) {
    const self = this;
    const apply = self.apply;
    if (apply) {
      return Util.contains(apply, geomType);
    }
    return true;
  }

  clear() {
    super.clear();
    const clip = this.clip;
    clip && clip.remove();
  }
}

module.exports = RegionFilter;
