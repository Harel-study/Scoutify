import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import api from '../../utils/axios';

export interface IJob {
  _id: string;
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
    builder.addCase(deleteJob.fulfilled, (state, action: PayloadAction<string>) => {
      state.jobs = state.jobs.filter((j) => j._id !== action.payload);
      if (state.currentJob && state.currentJob._id === action.payload) {
        state.currentJob = null;
      }
    });
  },
});

export const { clearCurrentJob } = jobSlice.actions;
export default jobSlice.reducer;
