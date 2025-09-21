import {
  Button,
  Component,
  Label,
  Node,
  Prefab,
  Vec3,
  _decorator,
  instantiate,
} from "cc";
import { Hand, getHand } from "./shared/hand";

import Flush from "./shared/hand/Flush";
import FourCards from "./shared/hand/FourCards";
import FullHouse from "./shared/hand/FullHouse";
import { MAX_TILES_PLAYABLE } from "././shared/constants";
import Pair from "./shared/hand/Pair";
import Single from "./shared/hand/Single";
import Straight from "./shared/hand/Straight";
import { TileController } from "./TileController";
import { TileNumber } from "./shared/tile";
import Triple from "./shared/hand/Triple";
import { getTopNumber } from "./shared/utils";

const { ccclass, property } = _decorator;

const TILE_SCALE = 0.3;
const TILE_COUNT = 15;
const TILE_GAP = 0.6;
const BUTTON_GAP = 52;

@ccclass("GameManager")
export class GameManager extends Component {
  @property(Prefab)
  tilePrefab: Prefab = null!;

  @property(Prefab)
  tileButtonPrefab: Prefab = null!;

  @property(Node)
  tileContainer: Node = null!;

  @property(Node)
  tileButtonContainer: Node = null!;

  @property(Node)
  handLabel: Node = null!;

  private tiles: Node[] = [];
  private tileButtons: Node[] = [];
  private tilesSelected: boolean[] = [];

  start() {
    for (let i = 0; i < TILE_COUNT; i++) {
      const tile = instantiate(this.tilePrefab);
      const tileButton = instantiate(this.tileButtonPrefab);
      const relativeX = i - (TILE_COUNT - 1) / 2;

      tile.parent = this.tileContainer;
      tile.setScale(TILE_SCALE, TILE_SCALE, TILE_SCALE);
      tile.setPosition(relativeX * TILE_GAP, 0, 0);
      tile.getComponent(TileController)!.number = (i + 1) as TileNumber;
      tile.getComponent(TileController)!.color = "SUN";
      this.tiles.push(tile);

      tileButton.parent = this.tileButtonContainer;
      tileButton.setPosition(relativeX * BUTTON_GAP, 0, 0);
      this.tileButtons.push(tileButton);

      this.tilesSelected[i] = false;
      tileButton.on(Button.EventType.CLICK, () => {
        this.tilesSelected[i] = !this.tilesSelected[i];
        tile.translate(
          new Vec3(0, 0, this.tilesSelected[i] ? -0.2 : +0.2),
          Node.NodeSpace.LOCAL
        );
        this.updateHandLabel();
      });
    }
  }

  update(deltaTime: number) {}

  private updateHandLabel() {
    const selectedTiles = this.tiles
      .filter((_, index) => this.tilesSelected[index])
      .map((tile) => tile.getComponent(TileController)!);

    const hand = getHand(selectedTiles, getTopNumber(5));
    this.handLabel.getComponent(Label)!.string = this.handToString(hand);
  }

  private handToString(hand: any | null): string {
    if (hand instanceof Single) {
      return `${hand.tile.number} 싱글`;
    }

    if (hand instanceof Pair) {
      return `${hand.tiles[0].number} 페어`;
    }

    if (hand instanceof Triple) {
      return `${hand.tiles[0].number} 트리플`;
    }

    if (hand instanceof FourCards) {
      return `${hand.number} 포카드`;
    }

    if (hand instanceof FullHouse) {
      return `${hand.number} 풀하우스`;
    }

    if (hand instanceof Flush) {
      return "플러시";
    }

    if (hand instanceof Straight) {
      switch (hand.name) {
        case "STRAIGHT":
          return `스트레이트`;
        case "STRAIGHT_FLUSH":
          return `스트레이트 플러시`;
        case "MOUNTAIN":
          return "마운틴";
        case "MOUNTAIN_FLUSH":
          return "마운틴 플러시";
        case "BACK_STRAIGHT_1":
        case "BACK_STRAIGHT_2":
          return "백 스트레이트";
        case "BACK_STRAIGHT_FLUSH_1":
        case "BACK_STRAIGHT_FLUSH_2":
          return "백 스트레이트 플러시";
      }
    }

    return "조합 없음";
  }
}
