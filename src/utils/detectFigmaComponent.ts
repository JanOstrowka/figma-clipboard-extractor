import componentAllowlist from './componentAllowlist.json';
import figmaPrimitives from './figmaPrimitives.json';

export interface DetectionResult {
	isLikelyComponent: boolean;
	confidence: 'high' | 'medium' | 'low';
	reason: string;
	message?: string;
	severity?: 'strong-warning' | 'soft-warning';
}

/**
 * Detects whether a Figma clipboard item is likely a real design system component
 * or just a generic Figma element.
 *
 * Key insight: When displayName is null, the item is NOT a Figma component at all.
 * Only actual Figma components have a displayName value.
 *
 * @param displayName - The displayName field from Figma clipboard data
 * @returns Detection result with confidence level and optional warning
 */
export function detectFigmaComponent(displayName: string | null): DetectionResult {
	// 1. Check for null displayName - definitively NOT a component
	if (displayName === null) {
		return {
			isLikelyComponent: false,
			confidence: 'high',
			reason: 'No displayName - this is not a Figma component',
			message:
				"This doesn't look like a component, but you can still use exported data below.",
			severity: 'strong-warning',
		};
	}

	// 2. Check for empty/whitespace
	if (displayName.trim() === '') {
		return {
			isLikelyComponent: false,
			confidence: 'high',
			reason: 'Empty displayName',
			message: "This element has no name, but you can still use the data below.",
			severity: 'strong-warning',
		};
	}

	// 3. Extract root name if variant pattern exists (e.g., "Button/Primary" → "Button")
	const rootName = displayName.includes('/') ? displayName.split('/')[0].trim() : displayName;

	// 4. Check component allowlist (case-insensitive)
	const normalizedRootName = rootName.toLowerCase();
	const matchedComponent = componentAllowlist.components.find(
		(component) => component.toLowerCase() === normalizedRootName,
	);

	if (matchedComponent) {
		const reason = displayName.includes('/')
			? `Matches known component with variant: ${matchedComponent}`
			: `Matches known component: ${matchedComponent}`;

		return {
			isLikelyComponent: true,
			confidence: 'high',
			reason,
		};
	}

	// 5. Check exact primitive match
	const normalizedDisplayName = displayName.toLowerCase();
	const matchedPrimitive = figmaPrimitives.primitives.find(
		(primitive) => primitive.toLowerCase() === normalizedDisplayName,
	);

	if (matchedPrimitive) {
		return {
			isLikelyComponent: true,
			confidence: 'medium',
			reason: 'Component exists but name matches Figma primitive',
			message: `This component is named "${displayName}" which is a Figma primitive name. You might want to rename it for clarity.`,
			severity: 'soft-warning',
		};
	}

	// 6. Check numbered primitive pattern (e.g., "Frame 1", "Rectangle 42")
	const numberedPrimitiveRegex = new RegExp(
		`^(${figmaPrimitives.primitives.join('|')}) \\d+$`,
		'i',
	);

	if (numberedPrimitiveRegex.test(displayName)) {
		return {
			isLikelyComponent: true,
			confidence: 'medium',
			reason: 'Component exists but name matches auto-generated pattern',
			message: `This component is named "${displayName}" which looks auto-generated. You might want to give it a more meaningful name.`,
			severity: 'soft-warning',
		};
	}

	// 7. Check PascalCase pattern
	const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;
	if (pascalCaseRegex.test(displayName)) {
		return {
			isLikelyComponent: true,
			confidence: 'medium',
			reason: 'PascalCase name, possibly a custom component',
		};
	}

	// 8. Fallback - displayName exists, so it IS a Figma component
	return {
		isLikelyComponent: true,
		confidence: 'low',
		reason: 'Component exists with non-standard naming',
	};
}
