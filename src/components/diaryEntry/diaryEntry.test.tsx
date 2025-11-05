const mockPush = jest.fn();
jest.mock("next/navigation", () => ({
    useRouter: () => ({
        push: mockPush,
    }),
}));

import "@testing-library/jest-dom";
import dayjs from "dayjs";
import { MOCK_DIARY_ENTRY } from "~data/diary/mock";
import { render, screen } from "~tests/utils/custom-testing-library";
import { toSentenceCase } from "~util/strings/normalize";
import DiaryEntry from "./diaryEntry";

describe("Diary Entry Component", () => {
    it("renders diary entry content", () => {
        render(<DiaryEntry entry={MOCK_DIARY_ENTRY} />);
        expect(
            screen.getByText(toSentenceCase(MOCK_DIARY_ENTRY.contentType)),
        ).toBeInTheDocument();
        expect(
            screen.getByText(MOCK_DIARY_ENTRY.contentBody),
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                dayjs(MOCK_DIARY_ENTRY.createTimestamp).format("MMMM D, YYYY"),
            ),
        ).toBeInTheDocument();
    });
});
