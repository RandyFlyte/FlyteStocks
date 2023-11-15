import clientPromise from '@/lib/dbConnect';
import { NextResponse } from 'next/server';

// /api Get requested
export async function GET(request) {
  // Connect to mongodb.
  const client = await clientPromise;
  const db = client.db('flyte-stocks');
  // Store all positions in a variable.
  const allComments = await db.collection('positions').find({}).toArray();
  // Return a response containing the positions.
  return NextResponse.json({ status: 200, data: allComments });
}

export async function POST(request) {
  // Await the client and connect to the database
  const client = await clientPromise;
  const db = client.db('flyte-stocks');

  try {
    // Put request body into requestData in json
    const requestData = await request.json();
    // Insert the new document into the 'positions' collection
    const result = await db.collection('positions').insertOne(requestData);
    // Check the result for success
    if (result.acknowledged && result.insertedId) {
      return NextResponse.json({
        status: 201,
        data: { insertedId: result.insertedId },
      });
    } else {
      return NextResponse.json({
        status: 500,
        data: { error: 'Failed to insert document' },
      });
    }
  } catch (error) {
    // Handle any errors that occur during the operation
    return NextResponse.json({
      status: 500,
      data: { error: error.message },
    });
  }
}
