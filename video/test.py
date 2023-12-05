from manim import *

class DistributedAlgorithms(Scene):
    def construct(self):
        self.camera.background_color = "#F9F2E5"
        
        nodes = [Dot(point=i * (2*RIGHT) + 4*LEFT + DOWN, color=BLACK, radius=0.2) for i in range(5)]
        #edges = [Arrow(nodes[0].get_center(), nodes[1].get_center())]
        edges = [Arrow(nodes[i].get_center(), nodes[(i + 1) % 5].get_center(), color=BLACK, max_tip_length_to_length_ratio=0) for i in range(4)]
        nodesGroup = VGroup(*nodes)
        edgesGroup = VGroup(*edges)
        packet = Dot(color=YELLOW).move_to(nodes[0].get_center())

        text1 = Text("Let's hold an election!", color=BLACK, font="DejaVu Sans Mono").scale(0.4).shift(UP*2 + LEFT*2)
        text2 = Text("All 5 nodes will designate a KING node.", color=BLACK, font="DejaVu Sans Mono", 
                        t2c={"KING": RED}).scale(0.4).shift(UP*1.5 + LEFT)

        self.play(Create(nodesGroup))
        self.wait(5)
        self.play(Create(edgesGroup))
        self.play(Create(text1))
        self.wait(1)
        self.play(Create(text2))

        self.wait(5)
        self.play(Create(packet))
