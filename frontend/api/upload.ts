// API functions for uploading files to the backend

const API_BASE_URL = 'http://localhost:3001';

export interface UploadResponse {
  success: boolean;
  filename?: string;
  path?: string;
  size?: number;
  originalname?: string;
  files?: string[]; // For list responses
  error?: string;
}

/**
 * Upload CSV file to backend
 */
export async function uploadCsv(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('csv', file);

  try {
    const response = await fetch(`${API_BASE_URL}/uploads/csv`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload CSV');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload CSV',
    };
  }
}

/**
 * Upload PDF certificate to backend
 */
export async function uploadCertificate(file: File): Promise<UploadResponse> {
  const formData = new FormData();
  formData.append('certificate', file);

  try {
    const response = await fetch(`${API_BASE_URL}/uploads/certificate`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to upload certificate');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to upload certificate',
    };
  }
}

/**
 * Get list of CSV files
 */
export async function getCsv(): Promise<UploadResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/uploads/csv`, {
      method: 'GET',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get csv');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get csv',
    };
  }
}

/**
 * Get list of certificate files
 */
export async function getCertificate(): Promise<UploadResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/uploads/certificate`, {
      method: 'GET',
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get certificate');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get certificate',
    };
  }
}

/**
 * Generate certificates based on uploaded files and fields configuration
 */
export async function generateCertificates(data: {
  csvFilename: string;
  certificateFilename: string;
  fields: Array<{
    csvColumn: string;
    x: number;
    y: number;
    fontSize: number;
    fontFamily?: string;
    fontWeight?: string;
  }>;
}): Promise<{ success: boolean; count?: number; files?: string[]; error?: string }> {
  try {
    const response = await fetch(`${API_BASE_URL}/generate/certificates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to generate certificates');
    }

    return await response.json();
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate certificates',
    };
  }
}