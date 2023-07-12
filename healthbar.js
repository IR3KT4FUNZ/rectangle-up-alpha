export class Healthbar {
    
    constructor (maxHealth, currentHealth) {
        this.maxHp = maxHealth;
        this.Hp = currentHealth;
    }

    update(newHealth) {
        this.Hp = newHealth;
    }

}
