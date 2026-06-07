import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { brandProfile, briefing } = data;

    if (!brandProfile || !briefing) {
      return NextResponse.json(
        { error: 'Missing brandProfile or briefing data' },
        { status: 400 }
      );
    }

    const clientId = brandProfile.clientId;
    const vaultBasePath = process.cwd();
    const clientVaultPath = join(vaultBasePath, 'vault', 'clients', clientId);

    try {
      // Create directory structure
      await mkdir(clientVaultPath, { recursive: true });

      // Write brand_profile.json
      const brandProfilePath = join(clientVaultPath, 'brand_profile.json');
      await writeFile(brandProfilePath, JSON.stringify(brandProfile, null, 2), 'utf-8');

      // Write briefing.json
      const briefingPath = join(clientVaultPath, 'briefing.json');
      await writeFile(briefingPath, JSON.stringify(briefing, null, 2), 'utf-8');

      // Write metadata.json
      const metadata = {
        exportedAt: new Date().toISOString(),
        version: '1.0',
        clientId,
        clientName: brandProfile.clientName,
        files: ['brand_profile.json', 'briefing.json'],
      };
      const metadataPath = join(clientVaultPath, 'metadata.json');
      await writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');

      return NextResponse.json({
        success: true,
        message: 'Export successful',
        paths: {
          brandProfile: brandProfilePath,
          briefing: briefingPath,
          metadata: metadataPath,
        },
        vaultPath: clientVaultPath,
      });
    } catch (fsError) {
      const message = fsError instanceof Error ? fsError.message : 'File system error';
      return NextResponse.json(
        { error: `Failed to write files: ${message}` },
        { status: 500 }
      );
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Invalid request';
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
