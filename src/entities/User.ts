export class User {
    private uuid?: string;
    private name: string;
    private surname: string;
    private email: string;
    private passwordHash: string;
    private createdAt?: Date;
    private activated: boolean;
    private userTypeId: string;
  
    constructor(
      name: string,
      surname: string,
      email: string,
      passwordHash: string,
      activated: boolean,
      userTypeId: string,
      createdAt?: Date,
      uuid?: string,
    ) {
      this.uuid = uuid;
      this.name = name;
      this.surname = surname;
      this.email = email;
      this.passwordHash = passwordHash;
      this.createdAt = createdAt;
      this.activated = activated;
      this.userTypeId = userTypeId;
    }
  
    // Getters
    public getUuid(): string | undefined {
      return this.uuid;
    }
  
    public getName(): string {
      return this.name;
    }
  
    public getSurname(): string {
      return this.surname;
    }
  
    public getEmail(): string {
      return this.email;
    }
  
    public getPasswordHash(): string {
      return this.passwordHash;
    }
  
    public getCreatedAt(): Date | undefined {
      return this.createdAt;
    }
  
    public getActivated(): boolean {
      return this.activated;
    }
  
    public getUserTypeId(): string {
      return this.userTypeId;
    }
  
    // Setters
    public setUuid(value: string | undefined): void {
        this.uuid = value;
    }
    public setName(value: string): void {
      this.name = value;
    }
  
    public setSurname(value: string): void {
      this.surname = value;
    }
  
    public setEmail(value: string): void {
      this.email = value;
    }
  
    public setPasswordHash(value: string): void {
      this.passwordHash = value;
    }
  
    public setCreatedAt(value: Date | undefined): void {
      this.createdAt = value;
    }
  
    public setActivated(value: boolean): void {
      this.activated = value;
    }
  
    public setUserTypeId(value: string): void {
      this.userTypeId = value;
    }
  }
  