export const mockSubmitAnalysis = async () => {
    // Simulate network
    return new Promise<{ jobId: string }>((resolve) => {
        setTimeout(() => {
            resolve({ jobId: Math.random().toString(36).substring(7) });
        }, 1200);
    });
};

export const mockPollAnalysis = async () => {
    return new Promise<{ status: "processing" | "completed" }>((resolve) => {
        setTimeout(() => {
            resolve({ status: "processing" }); // In our frontend we just do a visual timeout
        }, 500);
    });
};
