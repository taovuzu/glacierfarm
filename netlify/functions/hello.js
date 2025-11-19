/**
 * Netlify Function: Health Check
 * Simple endpoint to verify that Netlify Functions are working
 */

export const handler = async (event, context) => {
  try {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: 'GlacierFarm Netlify Functions are healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'unknown',
      }),
    };
  } catch (error) {
    console.error('Health check error:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        error: 'Health check failed',
        message: error.message,
      }),
    };
  }
};
