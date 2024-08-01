export default class Computer {
    constructor(boardSize) {
      this.boardSize = boardSize;
    }
  
    /**
     * Расчет атки
     *
     * @param positionedEnemyTeam команда противника
     * @param positionedPlayerTeam команда игрока
     * @returns {{enemyHero: PositionedCharacter, playerHero: PositionedCharacter} | false}
     */
    calculatingAttack(positionedEnemyTeam, positionedPlayerTeam) {
      const killOptions = [];
  
      let maxDamage = -Infinity;
      let minDistance = Infinity;
      let targetEnemyHero = null;
      let targetPlayerHero = null;
  
      positionedEnemyTeam.forEach((enemyHero) => {
        positionedPlayerTeam.forEach((playerHero) => {
          if (enemyHero.canAttack(playerHero.position, this.boardSize)) {
            const damage = this.constructor.damageCalculation(enemyHero, playerHero);
  
            if (playerHero.character.health - damage <= 0) {
              killOptions.push([enemyHero, playerHero]);
            } 
            const distance = this.distanceCalculation(enemyHero.position, playerHero.position);

            if ((damage > maxDamage) || (damage === maxDamage && distance < minDistance)) {
              maxDamage = damage;
              minDistance = distance;
              targetEnemyHero = enemyHero;
              targetPlayerHero = playerHero;
            }
          }
        });
      });
  
      if (killOptions.length) {
        targetEnemyHero = null;
        targetPlayerHero = null;
        minDistance = Infinity;
  
        killOptions.forEach(([enemyHero, playerHero]) => {
          const distance = this.distanceCalculation(enemyHero.position, playerHero.position);
  
          if (distance < minDistance) {
            targetPlayerHero = enemyHero;
            targetEnemyHero = enemyHero;
            minDistance = distance;
          }
        });
      }
  
      if (targetEnemyHero && targetPlayerHero) {
        return { enemyHero: targetEnemyHero, playerHero: targetPlayerHero };
      }
  
      return false;
    }
  
    /**
     * Расчет перемещения
     *
     * @returns {{enemyHero: PositionedCharacter, planMoveCell: number}}
     */
    calculatingMovement(positionedEnemyTeam, positionedPlayerTeam) {
      const positionedCharacters = [...positionedEnemyTeam, ...positionedPlayerTeam];
  
      let minDistanceBeforeMoving = Infinity;
      let minDistanceAfterMoving = Infinity;
      let targetEnemyHero = null;
      let targetPlanMoveCell = null;
  
      positionedEnemyTeam.forEach((enemyHero) => {
        positionedPlayerTeam.forEach((playerHero) => {
          const distanceBeforeMoving = this.distanceCalculation(
            enemyHero.position,
            playerHero.position,
          );
          let distanceAfterMoving = Infinity;
          let planMoveCell = null;
  
          this.generateMoveableCells(positionedCharacters, enemyHero).forEach((cell) => {
            const distance = this.distanceCalculation(cell, playerHero.position);
  
            if (distance < distanceAfterMoving) {
              distanceAfterMoving = distance;
              planMoveCell = cell;
            }
          });
  
          if (
            distanceBeforeMoving < minDistanceBeforeMoving || (
              distanceBeforeMoving === minDistanceBeforeMoving
              && distanceAfterMoving < minDistanceAfterMoving
            )
          ) {
            minDistanceBeforeMoving = distanceBeforeMoving;
            minDistanceAfterMoving = distanceAfterMoving;
            targetEnemyHero = enemyHero;
            targetPlanMoveCell = planMoveCell;
          }
        });
      });
  
      return { enemyHero: targetEnemyHero, planMoveCell: targetPlanMoveCell };
    }
  
    /**
     * Расчет урона
     *
     * @param attacker атакующий персонаж
     * @param target атакованный персонаж
     * @returns number
     */
    static damageCalculation(attacker, target) {
      const attackerAttack = attacker.character.attack;
      const targetDefence = target.character.defence;
  
      const damageDifferance = attackerAttack - targetDefence;
  
      const damage = Math.max(damageDifferance, attackerAttack * 0.1);
  
      return Math.floor(damage);
    }
  
    /**
     * Расчет дистанции
     *
     * @param position1 номер клетки
     * @param position2 номер клетки
     * @returns number
     */
    distanceCalculation(position1, position2) {
      const positionColumn1 = position1 % this.boardSize;
      const positionRow1 = Math.floor(position1 / this.boardSize);
      const positionColumn2 = position2 % this.boardSize;
      const positionRow2 = Math.floor(position2 / this.boardSize);
  
      return Math.abs(positionRow1 - positionRow2) + Math.abs(positionColumn1 - positionColumn2);
    }
  
    /**
     * Генерирует доступные для перемещения клетки
     *
     * @param positionedCharacters
     * @param currentPositionedCharacter
     * @returns Array
     */
    generateMoveableCells(positionedCharacters, currentPositionedCharacter) {
      const availableCells = [];
  
      const x = currentPositionedCharacter.position % this.boardSize;
      const y = Math.floor(currentPositionedCharacter.position / this.boardSize);
  
      const initialLimit = 0;
      const finalLimit = this.boardSize - 1;
  
      const occupiedCells = positionedCharacters.map((hero) => hero.position);
  
      for (let index = 1; index <= currentPositionedCharacter.character.moveRange; index += 1) {
        const xLeft = x - index;
        const xRight = x + index;
        const yBottom = y + index;
        const yTop = y - index;
  
        const coordinates = [
          { x, y: yBottom },
          { x, y: yTop },
          { x: xLeft, y },
          { x: xLeft, y: yBottom },
          { x: xLeft, y: yTop },
          { x: xRight, y },
          { x: xRight, y: yBottom },
          { x: xRight, y: yTop },
        ];
  
        coordinates.forEach((coordinate) => {
          const cell = coordinate.y * this.boardSize + coordinate.x;
  
          if (
            coordinate.x >= initialLimit
            && coordinate.x <= finalLimit
            && coordinate.y >= initialLimit
            && coordinate.y <= finalLimit
            && !occupiedCells.includes(cell)
          ) {
            availableCells.push(cell);
          }
        });
      }
  
      return availableCells;
    }
  }