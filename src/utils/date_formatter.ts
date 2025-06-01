class DateFormatter {
  
  private currentDate: Date;

  constructor() {
    this.currentDate = new Date();
  }

  public getFormattedDateTime(): string {
    const day: number = this.currentDate.getDate();
    const month: number = this.currentDate.getMonth() + 1; 
    const year: number = this.currentDate.getFullYear();
    const hours: number = this.currentDate.getHours();
    const minutes: number = this.currentDate.getMinutes();
    const seconds:number=this.currentDate.getSeconds()

    return `${year}-${month}-${day} ${hours}:${minutes.toString().padStart(2, '0')}:${seconds}`;
  }

  public formatDate(isoDate: string): string {
    const date = new Date(isoDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Mês começa do zero
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  public getFormattedDate(): string {
    const day: number = this.currentDate.getDate();
    const month: number = this.currentDate.getMonth() + 1; 
    const year: number = this.currentDate.getFullYear();

    return `${year}-${month}-${day}`;
  }

  public getFormattedTime(): string {
    const hours: number = this.currentDate.getHours();
    const minutes: number = this.currentDate.getMinutes();

    return `${hours}h:${minutes.toString().padStart(2, '0')}`;
  }
  public calculateDuration(startDateTime: string, endDateTime: string): string {
    // Convert dates to milliseconds
    const start: number = new Date(startDateTime).getTime();
    const end: number = new Date(endDateTime).getTime();
  
    // Calculate the difference in milliseconds
    const diffInMs: number = end - start;
  
    // Convert to days, hours, minutes, and seconds
    const days: number = Math.floor(diffInMs / (1000 * 60 * 60 * 24)); // Days
    const hours: number = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)); // Hours
    const minutes: number = Math.floor((diffInMs % (1000 * 60 * 60)) / (1000 * 60)); // Minutes
    const seconds: number = Math.floor((diffInMs % (1000 * 60)) / 1000); // Seconds
  
    // Return the formatted duration
    return `${days}d:${hours}:${minutes}:${seconds}`;
  }
  
}

export default DateFormatter;
