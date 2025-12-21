import { describe, it, expect } from 'vitest';
import { detectFigmaComponent } from './utils/detectFigmaComponent';

describe('App clipboard integration', () => {
	describe('Component detection integration', () => {
		it('should detect null displayName with strong warning (not a component)', () => {
			const result = detectFigmaComponent(null);
			expect(result.isLikelyComponent).toBe(false);
			expect(result.confidence).toBe('high');
			expect(result.severity).toBe('strong-warning');
			expect(result.message).toContain("doesn't look like a component");
			expect(result.message).toContain('can still use exported data');
		});

		it('should detect empty displayName with strong warning', () => {
			const result = detectFigmaComponent('');
			expect(result.isLikelyComponent).toBe(false);
			expect(result.confidence).toBe('high');
			expect(result.severity).toBe('strong-warning');
			expect(result.message).toContain('no name');
			expect(result.message).toContain('can still use the data');
		});

		it('should accept known components without warning', () => {
			const result = detectFigmaComponent('Button');
			expect(result.isLikelyComponent).toBe(true);
			expect(result.confidence).toBe('high');
			expect(result.message).toBeUndefined();
			expect(result.severity).toBeUndefined();
		});

		it('should show soft warning for primitive names', () => {
			const result = detectFigmaComponent('Frame');
			expect(result.isLikelyComponent).toBe(true);
			expect(result.confidence).toBe('medium');
			expect(result.severity).toBe('soft-warning');
			expect(result.message).toContain('Figma primitive name');
			expect(result.message).toContain('might want');
		});

		it('should show soft warning for auto-generated names', () => {
			const result = detectFigmaComponent('Frame 1');
			expect(result.isLikelyComponent).toBe(true);
			expect(result.confidence).toBe('medium');
			expect(result.severity).toBe('soft-warning');
			expect(result.message).toContain('auto-generated');
			expect(result.message).toContain('might want');
		});
	});

	describe('Expected user scenarios', () => {
		it('should warn but allow when user copies a raw frame (displayName is null)', () => {
			const clipboardData = {
				rawHtml: '<meta charset="utf-8">...',
				figmeta: 'some-meta-data',
				figbuffer: 'some-buffer-data',
				displayName: null,
				isValidFigmaData: true,
			};

			const detection = detectFigmaComponent(clipboardData.displayName);

			expect(detection.isLikelyComponent).toBe(false);
			expect(detection.severity).toBe('strong-warning');
			expect(detection.message).toContain("doesn't look like a component");
			expect(detection.message).toContain('can still use exported data');
			// Should not block - extraction proceeds with warning
		});

		it('should allow when user copies a proper Button component', () => {
			const clipboardData = {
				rawHtml: '<meta charset="utf-8">...',
				figmeta: 'some-meta-data',
				figbuffer: 'some-buffer-data',
				displayName: 'Button',
				isValidFigmaData: true,
			};

			const detection = detectFigmaComponent(clipboardData.displayName);

			expect(detection.isLikelyComponent).toBe(true);
			expect(detection.message).toBeUndefined();
			expect(detection.severity).toBeUndefined();
		});

		it('should warn but allow when user copies a component named "Frame"', () => {
			const clipboardData = {
				rawHtml: '<meta charset="utf-8">...',
				figmeta: 'some-meta-data',
				figbuffer: 'some-buffer-data',
				displayName: 'Frame',
				isValidFigmaData: true,
			};

			const detection = detectFigmaComponent(clipboardData.displayName);

			expect(detection.isLikelyComponent).toBe(true);
			expect(detection.severity).toBe('soft-warning');
			expect(detection.message).toContain('Figma primitive name');
			expect(detection.message).toContain('might want');
		});
	});
});
