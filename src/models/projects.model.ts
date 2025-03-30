export interface Project {
	id?: string;
	name: string;
	description: string;
}

export interface ProjectWithReports extends Project {
	reports?: Report[];
}

export interface Report {
	id?: string;
	text: string;
	project_id: string;
}
