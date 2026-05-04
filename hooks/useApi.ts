import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

/**
 * Retry logic with exponential backoff for rate-limited requests.
 * Retries up to 3 times with increasing delays: 2s, 4s, 8s
 */
async function fetchApi(url: string, options?: RequestInit, retryCount = 0): Promise<any> {
  try {
    const res = await fetch(url, options);
    
    const contentType = res.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error(`Server returned non-JSON response (${res.status}). Please check if the API route exists and is working.`);
    }

    const json = await res.json();
    if (!json.success) throw new Error(json.error || 'API Error');
    return json.data;
  } catch (error) {
    // Detect rate limit errors and retry with exponential backoff
    const isRateLimit = 
      error instanceof Error && 
      (error.message.includes('429') || 
       error.message.toLowerCase().includes('too many requests') ||
       error.message.toLowerCase().includes('quota'));
    
    if (isRateLimit && retryCount < 3) {
      const delay = Math.pow(2, retryCount + 1) * 1000; // 2s, 4s, 8s
      await new Promise(resolve => setTimeout(resolve, delay));
      return fetchApi(url, options, retryCount + 1);
    }
    
    throw error;
  }
}

export function useProjects() {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => fetchApi('/api/projects'),
  });
}

export function useProductInstances(projectId?: string) {
  return useQuery({
    queryKey: ['instances', projectId],
    queryFn: () => fetchApi(`/api/projects/${projectId}/instances`),
    enabled: !!projectId,
  });
}

export function useConversations(projectId?: string, productInstanceId?: string) {
  return useQuery({
    queryKey: ['conversations', projectId, productInstanceId],
    queryFn: () => fetchApi(`/api/conversations?projectId=${projectId}&productInstanceId=${productInstanceId}`),
    enabled: !!projectId && !!productInstanceId,
  });
}

export function useMessages(conversationId?: string) {
  return useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => fetchApi(`/api/conversations/${conversationId}/messages`),
    enabled: !!conversationId,
  });
}

export function useDashboardConfig(projectId?: string) {
  return useQuery({
    queryKey: ['dashboard-config', projectId],
    queryFn: () => fetchApi(`/api/admin/dashboard-config?projectId=${projectId}`),
    enabled: !!projectId,
  });
}

export function useChat() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: { conversationId: string; message: string }) =>
      fetchApi('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['messages', variables.conversationId] });
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
    },
    retry: 2, // Retry failed mutations up to 2 times
    retryDelay: (attemptIndex) => Math.pow(2, attemptIndex) * 1000, // 1s, 2s, 4s
  });
}

export function useLogin() {
    return useMutation({
        mutationFn: (email: string) =>
            fetchApi('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            }),
    });
}
