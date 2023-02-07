export interface Issue {
  id: number;
  title: string;
}

export interface Epic extends Issue {
  issues: Issue[];
}
