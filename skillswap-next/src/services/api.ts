// API Client connecting frontend to FastAPI / PyTorch / YOLOv8 Backend

export const API_BASE_URL = 'http://localhost:8000';

export interface SystemInfo {
  torch_available: boolean;
  torch_version: string | null;
  cuda_available: boolean;
  device: string;
  ultralytics_available: boolean;
  yolo_loaded: boolean;
  model_architecture: string;
}

export interface HealthResponse {
  status: string;
  system_info: SystemInfo;
}

export interface PreprocessResponse {
  success: boolean;
  width: number;
  height: number;
  processed_image_base64: string;
  applied_filters: {
    bilateral_strength: number;
    clahe: boolean;
    slant_range: boolean;
  };
}

export interface DetectionResponse {
  success: boolean;
  inference_time_ms: number;
  device_used: string;
  engine: string;
  detected_count: number;
  debris: any[];
}

export async function checkBackendHealth(): Promise<{ online: boolean; info?: SystemInfo }> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const res = await fetch(`${API_BASE_URL}/api/health`, { signal: controller.signal });
    clearTimeout(timeoutId);
    if (!res.ok) return { online: false };
    const data: HealthResponse = await res.json();
    return { online: true, info: data.system_info };
  } catch {
    return { online: false };
  }
}

export async function runPreprocessAPI(
  file: File,
  bilateralStrength: number,
  clahe: boolean,
  slantRange: boolean
): Promise<PreprocessResponse | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('bilateral_strength', bilateralStrength.toString());
    formData.append('clahe', clahe.toString());
    formData.append('slant_range', slantRange.toString());

    const res = await fetch(`${API_BASE_URL}/api/preprocess`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Preprocessing API unavailable, using client preview:', err);
    return null;
  }
}

export async function runDetectAPI(
  file: File,
  confidenceThreshold: number = 0.5,
  latitude: number = 57.7042,
  longitude: number = 10.5975,
  depth: number = 48.0
): Promise<DetectionResponse | null> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('confidence_threshold', confidenceThreshold.toString());
    formData.append('latitude', latitude.toString());
    formData.append('longitude', longitude.toString());
    formData.append('depth', depth.toString());

    const res = await fetch(`${API_BASE_URL}/api/detect`, {
      method: 'POST',
      body: formData,
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Detection API unavailable:', err);
    return null;
  }
}

export async function generateReportAPI(
  surveyName: string,
  location: string,
  debrisList: any[]
): Promise<any> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/report`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        survey_name: surveyName,
        location: location,
        debris_list: debrisList,
      }),
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (err) {
    console.warn('Report API offline:', err);
    return null;
  }
}
