import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function DELETE(
  _request: Request,
  { params }: { params: { accountId: string } },
) {
  const { accountId } = params;

  if (!accountId) {
    return NextResponse.json(
      { error: 'Account ID is required' },
      { status: 400 },
    );
  }

  try {
    await deleteAccount(accountId);
    return NextResponse.json(
      { message: 'Account deleted successfully' },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error deleting account:', error);
    return handleError(error);
  }
}

async function deleteAccount(accountId: string): Promise<void> {
  const response = await fetch(
    `${process.env.BASE_URL}/accounts/${accountId}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookies().toString(),
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  await validateJsonResponse(response);
}

async function validateJsonResponse(response: Response): Promise<void> {
  const responseData = await response.text();
  try {
    JSON.parse(responseData);
  } catch (parseError) {
    console.error('Error parsing response:', parseError);
    throw new Error('Invalid response from server');
  }
}

function handleError(error: unknown): NextResponse {
  const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
  return NextResponse.json({ error: errorMessage }, { status: 500 });
}