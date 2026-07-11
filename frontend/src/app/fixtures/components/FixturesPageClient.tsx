"use client";

import { useState, useCallback } from "react";
import type { Fixture } from "@/thesportsdb/fixtures";
import FixtureFilters from "./FixtureFilters";
import FixtureDetailPanel from "./FixtureDetailPanel";

export default function FixturesPageClient({ fixtures }: { fixtures: Fixture[] }) {
    const [selectedFixtureId, setSelectedFixtureId] = useState<number | null>(null);
    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const handleSelectFixture = useCallback((fixture: Fixture) => {
        setSelectedFixtureId(fixture.fixture.id);
        setIsPanelOpen(true);
    }, []);

    const handleClosePanel = useCallback(() => {
        setIsPanelOpen(false);
        setSelectedFixtureId(null);
    }, []);

    return (
        <div className="flex gap-4">
            <div className="flex-1 min-w-0">
                <FixtureFilters fixtures={fixtures} onSelectFixture={handleSelectFixture} selectedFixtureId={selectedFixtureId} />
            </div>
            <FixtureDetailPanel fixtureId={selectedFixtureId} onClose={handleClosePanel} />
        </div>
    );
}
