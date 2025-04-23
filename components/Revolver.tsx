'use client'

import SegmentLoading from './SegmentLoading'

interface Props {
  items: object[]
}

export default function Revolver() {
  return <SegmentLoading segmentType="arc" />
}
