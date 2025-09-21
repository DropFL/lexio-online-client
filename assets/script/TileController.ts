import {
  Button,
  Component,
  Material,
  MeshRenderer,
  Node,
  _decorator,
  error,
  log,
  resources,
} from "cc";
import { Tile, TileColor, TileNumber } from "shared/tile";

const { ccclass, property, disallowMultiple, type } = _decorator;

@ccclass("TileController")
@disallowMultiple(true)
export class TileController extends Component implements Tile {
  private renderer: MeshRenderer | null = null;

  @property
  private _color: TileColor = "CLOUD";
  @property
  get color() {
    return this._color;
  }
  set color(value: TileColor) {
    if (this._color !== value) {
      this._color = value;
      this.updateMaterial();
    }
  }

  @property({ range: [1, 15, 1] })
  private _number: TileNumber = 1;
  @property({ range: [1, 15, 1] })
  get number() {
    return this._number;
  }
  set number(value: TileNumber) {
    if (this._number !== value) {
      this._number = value;
      this.updateMaterial();
    }
  }

  private updateMaterial() {
    if (this.renderer) {
      const path = `material/${this.color}${this.number}`;
      resources.load(path, Material, (err, asset) => {
        if (err) {
          error("Failed to load material");
          error(err);
          this.renderer!.materials = [];
        } else {
          log("Material loaded");
          this.renderer!.materials = [asset];
        }
      });
    }
  }

  start() {
    this.renderer = this.node
      .getChildByName("Plane")
      ?.getComponent(MeshRenderer)!;

    this.updateMaterial();
  }

  update(deltaTime: number) {}
}
