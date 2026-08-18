    import { Schema, Document, model } from 'mongoose';


    export interface IProject extends Document {
        image: string;
        title: string;
        description: string;
        tags: string[];
        liveDemoUrl?: string;
        githubUrl?: string;
    }

    const projectSchema = new Schema<IProject> ({
        image: {type: String, required: true},
        title:{type: String, required: true},
        description:{type: String, required: true},
        tags: [{type: String, required: true}],
        liveDemoUrl: {type: String, default:'#'},
        githubUrl: {type: String, default:'#'}
    })

    export const Project = model<IProject>('Project', projectSchema);