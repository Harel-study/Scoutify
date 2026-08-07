/**
 * @module JobSlice
 *
 * Manages the global state for the jobs board, including listing jobs,
 * viewing job details, and creating or applying to job postings.
 */
import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/axios';

/**
 * Represents a job posting within the platform.
 * 
 * Contains details about the role, location, and the user or team
 * that created the posting.
 */
export interface IJob {
  _id: string;
  hasApplied?: boolean;
  profileId: {
    _id: string;
    name?: string;
    city?: string;
    profileImage?: string;
    roleDescription?: string;
    userID?: {
      _id: string;
      username?: string;
      email?: string;
      role: 'player' | 'team' | 'staff';
    };
  };
  profileModel: 'User' | 'Team';
  title: string;
  description: string;
  city: string;
  jobType: 'Full-Time' | 'Part-Time' | 'Shift-work' | 'Contract' | 'Temporary' | 'Internship';
  status: boolean;
  createdAt: string;
  updatedAt: string;
}

interface JobState {
  jobs: IJob[];
  currentJob: IJob | null;
  loading: boolean;
  error: string | null;
}

const initialState: JobState = {
  jobs: [],
  currentJob: null,
  loading: false,
  error: null,
};

/**
 * Fetches a list of job postings, optionally filtered by search parameters.
 *
 * @param  {Record<string, string>}  [filters={}]  Optional query parameters for filtering jobs (e.g., city, jobType).
 * @returns {Promise<IJob[]>}  The array of job postings matching the criteria.
 * @throws  {string}  The error message if the request fails.
 */
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async (filters: Record<string, string> = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`/jobs?${params}`);
      return response.data.jobs as IJob[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch jobs');
    }
  }
);

/**
 * Fetches the complete details for a specific job posting.
 *
 * Sets the retrieved job as the `currentJob` in the state.
 *
 * @param  {string}  jobId  The unique ID of the job to fetch.
 * @returns {Promise<IJob>}  The detailed job object.
 * @throws  {string}  The error message if the request fails.
 */
export const fetchJobDetails = createAsyncThunk(
  'jobs/fetchJobDetails',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/jobs/${jobId}`);
      return response.data.job as IJob;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch job details');
    }
  }
);

/**
 * Creates a new job posting on the platform.
 *
 * The newly created job is prepended to the local jobs list state upon success.
 *
 * @param  {Partial<IJob>}  jobData  The data payload for the new job.
 * @returns {Promise<IJob>}  The successfully created job object from the server.
 * @throws  {string}  The error message if creation fails.
 */
export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData: Partial<IJob>, { rejectWithValue }) => {
    try {
      const response = await api.post('/jobs', jobData);
      return response.data.job as IJob;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create job');
    }
  }
);

/**
 * Updates an existing job posting.
 *
 * Updates the job in the local list and also updates `currentJob` if it matches.
 *
 * @param  {Object}  args  The payload arguments.
 * @param  {string}  args.jobId  The ID of the job to update.
 * @param  {Partial<IJob>}  args.jobData  The fields to update.
 * @returns {Promise<IJob>}  The updated job object from the server.
 * @throws  {string}  The error message if the update fails.
 */
export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ jobId, jobData }: { jobId: string; jobData: Partial<IJob> }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/jobs/${jobId}`, jobData);
      return response.data.job as IJob;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update job');
    }
  }
);

/**
 * Permanently deletes a job posting.
 *
 * Removes the job from the local list and clears `currentJob` if it matches.
 *
 * @param  {string}  jobId  The ID of the job to delete.
 * @returns {Promise<string>}  The ID of the successfully deleted job.
 * @throws  {string}  The error message if deletion fails.
 */
export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (jobId: string, { rejectWithValue }) => {
    try {
      await api.delete(`/jobs/${jobId}`);
      return jobId;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to delete job');
    }
  }
);

/**
 * Submits an application to a specific job posting for the current user.
 *
 * @param  {string}  jobId  The ID of the job to apply for.
 * @returns {Promise<{jobId: string, message: string}>}  A success message from the server.
 * @throws  {string}  The error message if the application submission fails.
 */
export const applyToJob = createAsyncThunk(
  'jobs/applyToJob',
  async (jobId: string, { rejectWithValue }) => {
    try {
      const response = await api.post(`/jobs/${jobId}/apply`);
      return { jobId, message: response.data.message };
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to apply to job');
    }
  }
);

const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    /**
     * Clears the currently viewed job from the state.
     * Useful for resetting the view when navigating away from a job details page.
     */
    clearCurrentJob: (state) => {
      state.currentJob = null;
    }
  },
  extraReducers: (builder) => {
    // Fetch Jobs
    builder.addCase(fetchJobs.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchJobs.fulfilled, (state, action: PayloadAction<IJob[]>) => {
      state.loading = false;
      state.jobs = action.payload;
    });
    builder.addCase(fetchJobs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch Job Details
    builder.addCase(fetchJobDetails.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchJobDetails.fulfilled, (state, action: PayloadAction<IJob>) => {
      state.loading = false;
      state.currentJob = action.payload;
    });
    builder.addCase(fetchJobDetails.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create Job
    builder.addCase(createJob.fulfilled, (state, action: PayloadAction<IJob>) => {
      state.jobs.unshift(action.payload);
    });

    // Update Job
    builder.addCase(updateJob.fulfilled, (state, action: PayloadAction<IJob>) => {
      const index = state.jobs.findIndex((j) => j._id === action.payload._id);
      if (index > -1) {
        state.jobs[index] = action.payload;
      }
      if (state.currentJob && state.currentJob._id === action.payload._id) {
        state.currentJob = action.payload;
      }
    });

// Delete Job
builder.addCase(
  deleteJob.fulfilled,
  (state, action: PayloadAction<string>) => {
    state.jobs = state.jobs.filter(
      (job) => job._id !== action.payload
    );

    if (
      state.currentJob &&
      state.currentJob._id === action.payload
    ) {
      state.currentJob = null;
    }
  }
);

// Apply to Job
  builder.addCase(
    applyToJob.fulfilled,
  (
    state,
    action: PayloadAction<{
      jobId: string;
      message: string;
    }>
  ) => {
    const job = state.jobs.find(
      (item) => item._id === action.payload.jobId
    );
    if (job) {
      job.hasApplied = true;
    }
    if (
      state.currentJob &&
      state.currentJob._id === action.payload.jobId
    ) {
      state.currentJob.hasApplied = true;
    }
  }
);
  },
});
export const { clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
