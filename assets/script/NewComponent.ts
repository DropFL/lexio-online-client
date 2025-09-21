import { Component, Node, _decorator } from "cc";

import { Client } from "db://colyseus-sdk/colyseus.js";
import { GameState } from "shared/state"; // Adjust the import path as necessary

const { ccclass, property } = _decorator;

// const client = new Client("ws://localhost:2567");
// const a = await client.join<GameState>("my_room");

@ccclass("NewComponent")
export class NewComponent extends Component {
  start() {}

  update(deltaTime: number) {}
}
